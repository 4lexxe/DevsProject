import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../modules/user/User";
import Role from "../../modules/role/Role";
import { SessionService } from "../../modules/auth/services/session.service";

interface UserWithRole extends User {
  Role?: Role;
}

// Middleware de autenticación opcional: intenta autenticar pero no bloquea si no hay token
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Intentar obtener el token desde las cookies HttpOnly primero, luego desde el header Authorization
    const cookieToken = req.cookies?.auth_token;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(" ")[1];
    const token = cookieToken || headerToken;
    
    // Si no hay token, continuar sin autenticación
    if (!token) {
      req.user = undefined;
      next();
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleId: number };
      
      // Verificar si el token existe y está activo en la base de datos
      const isValidToken = await SessionService.validateToken(decodedToken.id, token);
      if (!isValidToken) {
        // Token inválido, continuar sin autenticación
        req.user = undefined;
        next();
        return;
      }

      await SessionService.updateTokenUsage(decodedToken.id, token);
      
      const user = await User.findByPk(decodedToken.id, {
        include: [{
          association: 'Role',
          include: ['Permissions']
        }]
      });

      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    } catch (error) {
      // Si hay error al verificar el token, continuar sin autenticación
      req.user = undefined;
    }

    next();
  } catch (error) {
    // En caso de error, continuar sin autenticación
    console.error('Error en autenticación opcional:', error);
    req.user = undefined;
    next();
  }
};
