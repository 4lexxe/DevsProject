import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../modules/user/User";
import Role from "../../modules/role/Role";
import { GeoUtils } from "../../modules/auth/utils/geo.utils";
import { SessionService } from "../../modules/auth/services/session.service";

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

// Funciones auxiliares para manejar sesiones persistentes
const updateTokenUsage = async (userId: number, token: string): Promise<void> => {
  await SessionService.updateTokenUsage(userId, token);
};

const cleanupExpiredTokens = async (userId: number): Promise<void> => {
  // La limpieza se maneja automáticamente en el servicio de sesiones
  await SessionService.cleanupExpiredSessions();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Intentar obtener el token desde las cookies HttpOnly primero, luego desde el header Authorization como fallback
    const cookieToken = req.cookies?.auth_token;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(" ")[1];
    const token = cookieToken || headerToken;
    
    // Debug: Log para verificar cookies
    console.log('🍪 Debug Cookies:', {
      allCookies: req.cookies,
      authToken: cookieToken,
      hasAuthHeader: !!authHeader,
      finalToken: token ? 'Token presente' : 'No token',
      url: req.url
    });
    
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
        
        // Verificar si el token existe y está activo en la base de datos
        const isValidToken = await SessionService.validateToken(decodedToken.id, token);
        if (!isValidToken) {
          res.status(401).json({ 
            message: "Token inválido o expirado",
            details: "Por favor, inicie sesión nuevamente"
          });
          return;
        }

        await updateTokenUsage(decodedToken.id, token);
        
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

    await cleanupExpiredTokens(user.id);

    // Obtener sesiones del usuario desde la base de datos
    const userSessions = await SessionService.getUserSessions(user.id);

    req.tokenInfo = {
      token: token || undefined,
      decoded: decodedToken,
      sessions: userSessions
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

// Función de registro actualizada con geolocalización y persistencia
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

    // Registrar sesión en la base de datos
    await SessionService.registerSession(userId, session);
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

    // Registrar sesión en la base de datos como fallback
    await SessionService.registerSession(userId, session);
  }
};

// Funciones actualizadas para usar persistencia
export const revokeToken = async (userId: number, token: string): Promise<void> => {
  await SessionService.revokeToken(userId, token);
};

export const revokeAllTokens = async (userId: number): Promise<void> => {
  await SessionService.revokeAllTokens(userId);
};