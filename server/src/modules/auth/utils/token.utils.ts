import jwt from "jsonwebtoken";
import { Request } from "express";
import User from "../../user/User";
import { registerToken, userTokens } from "../../../shared/middleware/authMiddleware";
import { GeoUtils } from "./geo.utils";
import { TokenSession } from "../../../shared/types/auth.types";

export class TokenUtils {
  static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        username: user.username,
        authProvider: user.authProvider,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
  }

  static async getAuthResponse(user: User, req: Request) {
    const token = this.generateToken(user);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geoData = await GeoUtils.getGeoData(ip as string);

    const sessionData: TokenSession = {
      token,
      createdAt: new Date(),
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'] || 'Desconocido',
      ipAddress: geoData.anonymizedIp ?? 'unknown',
      geoLocation: {
        city: geoData.city,
        region: geoData.region,
        country: geoData.country,
        loc: geoData.loc,
        timezone: geoData.timezone,
        isProxy: geoData.isProxy ?? false,
        org: geoData.org
      }
    };

    registerToken(user.id, token, req);
    
    const sessions = userTokens.get(user.id) || [];
    sessions.push(sessionData);
    userTokens.set(user.id, sessions);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        authProvider: user.authProvider,
      },
      sessions: sessions.map(session => ({
        token: session.token,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        device: session.userAgent,
        location: {
          ip: session.ipAddress,
          city: session.geoLocation?.city ?? null,
          region: session.geoLocation?.region ?? null,
          country: session.geoLocation?.country ?? null,
          coordinates: session.geoLocation?.loc ?? null,
          isProxy: session.geoLocation?.isProxy ?? false
        }
      }))
    };
  }
}