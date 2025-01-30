import { Request, Response, NextFunction } from "express";
import User from "../../modules/user/User";

export const permissionsMiddleware = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as User; // Aquí estamos diciendo que `user` es de tipo `User`

    if (!user) {
      res.status(401).json({ 
        message: "Usuario no autenticado", 
        details: "No se encontró al usuario" 
      });
      return;
    }

    // Verificar si el usuario tiene los permisos necesarios
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];

    const hasPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermissions) {
      res.status(403).json({ 
        message: "Acceso denegado uwu", 
        details: "No tienes los permisos necesarios para esta acción" 
      });
      return;
    }

    next();
  };
};