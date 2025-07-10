import { Request, Response, NextFunction } from "express";
import User from "../../modules/user/User";

export const permissionsMiddleware = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ 
        message: "Usuario no autenticado", 
        details: "No se encontró al usuario" 
      });
      return;
    }

    // Los superadmin tienen acceso total
    if (user.Role?.name === 'superadmin') {
      next();
      return;
    }

    // Verificar si el usuario tiene los permisos necesarios
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];

    const hasPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermissions) {
      res.status(403).json({ 
        message: "Acceso denegado", 
        details: `No tienes los permisos necesarios para esta acción. Permisos requeridos: ${requiredPermissions.join(', ')}`,
        requiredPermissions,
        userPermissions
      });
      return;
    }

    next();
  };
};