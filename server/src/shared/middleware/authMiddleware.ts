import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../modules/user/User"
import Admin from "../../modules/admin/Admin"

declare global {
  namespace Express {
    interface Request {
      tokenInfo?: {
        token: string | undefined;
        decoded: JwtPayload | null;
        sessions: TokenSession[];
      };
    }
  }
}

interface JwtPayload {
  id: number
  email: string
  roleId: number
}

interface TokenSession {
  token: string
  createdAt: Date
  lastUsed: Date
  expiresAt: Date
  userAgent?: string
  ipAddress?: string
}

// Almacén en memoria de tokens activos por usuario
export const userTokens = new Map<number, TokenSession[]>();

const updateTokenUsage = (userId: number, token: string) => {
  const userSessions = userTokens.get(userId) || [];
  const sessionIndex = userSessions.findIndex(s => s.token === token);
  
  if (sessionIndex !== -1) {
    userSessions[sessionIndex].lastUsed = new Date();
    userTokens.set(userId, userSessions);
  }
};

const cleanupExpiredTokens = (userId: number) => {
  const userSessions = userTokens.get(userId) || [];
  const now = new Date();
  const validSessions = userSessions.filter(session => session.expiresAt > now);
  userTokens.set(userId, validSessions);
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Verificar token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    // Si no hay token ni sesión, denegar acceso
    if (!token && !req.user) {
      res.status(401).json({ 
        message: "Acceso denegado",
        details: "Se requiere autenticación"
      });
      return;
    }

    let user: any;
    let decodedToken: JwtPayload | null = null;

    if (token) {
      try {
        // Verificar token
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        
        // Verificar si el token está en la lista de tokens activos
        const userSessions = userTokens.get(decodedToken.id) || [];
        const validToken = userSessions.some(session => session.token === token);
        
        if (!validToken) {
          res.status(401).json({ 
            message: "Token inválido o expirado",
            details: "Por favor, inicie sesión nuevamente"
          });
          return;
        }

        // Actualizar último uso del token
        updateTokenUsage(decodedToken.id, token);
        
        user = await User.findByPk(decodedToken.id, {
          include: ["Role"]
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
      // Usar usuario de la sesión
      user = await User.findByPk((req.user as any).id, {
        include: ["Role"]
      });
    }

    if (!user) {
      res.status(401).json({ 
        message: "Usuario no encontrado",
        details: "La cuenta puede haber sido eliminada"
      });
      return;
    }

    // Limpiar tokens expirados
    cleanupExpiredTokens(user.id);

    // 2. Verificar rol y permisos
    const isSuperAdmin = user.Role && user.Role.name === 'superadmin';
    const isRoleIdTwo = user.roleId === 2;

    if (!isSuperAdmin && !isRoleIdTwo) {
      res.status(403).json({ 
        message: "Acceso denegado",
        details: "Se requieren privilegios de administrador"
      });
      return;
    }

    // Agregar información del token a la request
    req.tokenInfo = {
      token,
      decoded: decodedToken,
      sessions: userTokens.get(user.id) || []
    };

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ 
      message: "Error de autenticación",
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Función para registrar un nuevo token
export const registerToken = (userId: number, token: string, req: Request) => {
  const session: TokenSession = {
    token,
    createdAt: new Date(),
    lastUsed: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  };

  const userSessions = userTokens.get(userId) || [];
  userSessions.push(session);
  userTokens.set(userId, userSessions);
};

// Función para revocar un token específico
export const revokeToken = (userId: number, token: string) => {
  const userSessions = userTokens.get(userId) || [];
  const updatedSessions = userSessions.filter(session => session.token !== token);
  userTokens.set(userId, updatedSessions);
};

// Función para revocar todos los tokens de un usuario
export const revokeAllTokens = (userId: number) => {
  userTokens.delete(userId);
};
