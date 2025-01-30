import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../../modules/user/User";
import Role from "../../modules/role/Role";
import { GeoUtils } from "../../modules/auth/utils/geo.utils"; // Importar GeoUtils
import Course from "../../modules/course/Course"; // Importar Course
import Admin from "../../modules/admin/Admin"; // Importar Admin
import Section from "../../modules/section/Section"; // Importar Section

declare global {
  namespace Express {
    interface Request {
      tokenInfo?: TokenInfo;
      user?: User | undefined;
    }
  }
}

// Interfaces actualizadas
export interface JwtPayload {
  id: number;
  email: string;
  roleId: number;
}

export interface TokenSession {
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  geoLocation?: {
    city?: string;
    region?: string;
    country?: string;
    loc?: [number, number];
    timezone?: string;
    isProxy: boolean;
    org?: string;
  };
}

interface TokenInfo {
  token: string | undefined;
  decoded: JwtPayload | null;
  sessions: TokenSession[];
}

interface UserWithRole extends User {
  Role?: Role;
}

// Almacén en memoria actualizado
export const userTokens = new Map<number, TokenSession[]>();

const updateTokenUsage = (userId: number, token: string): void => {
  const userSessions = userTokens.get(userId) || [];
  const sessionIndex = userSessions.findIndex(s => s.token === token);
  
  if (sessionIndex !== -1) {
    userSessions[sessionIndex].lastUsed = new Date();
    userTokens.set(userId, userSessions);
  }
};

const cleanupExpiredTokens = (userId: number): void => {
  const userSessions = userTokens.get(userId) || [];
  const now = new Date();
  const validSessions = userSessions.filter(session => session.expiresAt > now);
  userTokens.set(userId, validSessions);
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    
    if (!token && !req.user) {
      res.status(401).json({ 
        message: "Acceso denegado",
        details: "Se requiere autenticación"
      });
      return;
    }

    let user: UserWithRole | null = null;
    let decodedToken: JwtPayload | null = null;

    if (token) {
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        
        const userSessions = userTokens.get(decodedToken.id) || [];
        if (!userSessions.some(session => session.token === token)) {
          res.status(401).json({ 
            message: "Token inválido o expirado",
            details: "Por favor, inicie sesión nuevamente"
          });
          return;
        }

        updateTokenUsage(decodedToken.id, token);
        
        user = await User.findByPk(decodedToken.id, {
          include: [{
            association: 'Role',
            include: ['Permissions']
          }]
        });
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          res.status(401).json({ 
            message: "Token expirado",
            details: "Por favor, inicie sesión nuevamente"
          });
          return;
        }
        throw error;
      }
    } else {
      user = await User.findByPk((req.user as UserWithRole)?.id, {
        include: [{
          association: 'Role',
          include: ['Permissions']
        }]
      });
    }

    if (!user) {
      res.status(401).json({ 
        message: "Usuario no encontrado",
        details: "La cuenta puede haber sido eliminada"
      });
      return;
    }

    cleanupExpiredTokens(user.id);

    const isAuthorized = user.Role?.name === 'superadmin' || user.roleId === 2;
    if (!isAuthorized) {
      res.status(403).json({ 
        message: "Acceso denegado",
        details: "Se requieren privilegios de administrador"
      });
      return;
    }

    req.tokenInfo = {
      token: token || undefined,
      decoded: decodedToken,
      sessions: userTokens.get(user.id) || []
    };

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(401).json({ 
      message: "Error de autenticación",
      details: errorMessage
    });
  }
};

// Función de registro actualizada con geolocalización
export const registerToken = async (userId: number, token: string, req: Request): Promise<void> => {
  try {
    const ip = req.ip || req.connection.remoteAddress || '';
    const geoData = await GeoUtils.getGeoData(ip);
    
    const session: TokenSession = {
      token,
      createdAt: new Date(),
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 86400000), // 24 horas
      userAgent: req.headers['user-agent'] || '',
      ipAddress: geoData.anonymizedIp,
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

    const userSessions = userTokens.get(userId) || [];
    userSessions.push(session);
    userTokens.set(userId, userSessions);
  } catch (error) {
    console.error('Error registrando token con geolocalización:', error);
    // Fallback sin datos geográficos
    const session: TokenSession = {
      token,
      createdAt: new Date(),
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip
    };

    const userSessions = userTokens.get(userId) || [];
    userSessions.push(session);
    userTokens.set(userId, userSessions);
  }
};

// Funciones existentes se mantienen igual
export const revokeToken = (userId: number, token: string): void => {
  const userSessions = userTokens.get(userId) || [];
  userTokens.set(userId, userSessions.filter(s => s.token !== token));
};

export const revokeAllTokens = (userId: number): void => {
  userTokens.delete(userId);
};