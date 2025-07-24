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

    // Verificar si el usuario tiene al menos uno de los permisos necesarios (OR logic)
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];

    const hasAnyPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAnyPermission) {
      res.status(403).json({ 
        message: "Acceso denegado", 
        details: `No tienes ninguno de los permisos necesarios para esta acción. Permisos requeridos: ${requiredPermissions.join(' O ')}`,
        requiredPermissions,
        userPermissions
      });
      return;
    }

    next();
  };
};