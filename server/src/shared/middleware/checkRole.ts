import { Request, Response, NextFunction } from 'express';
import User from '../../modules/user/User';

export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Verificar que el usuario esté autenticado
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Obtener el usuario con el rol asociado
      const userWithRole = await User.findByPk(user.id, {
        include: ['Role']
      });

      if (!userWithRole || !userWithRole.dataValues.Role) {
        res.status(403).json({ error: 'Acceso denegado. No se encontró el rol.' });
        return;
      }

      // Obtenemos el rol del usuario
      const userRole = userWithRole.dataValues.Role.dataValues.name;

      // Si el usuario es admin, permitir acceso inmediato
      if (userRole === 'superadmin') {
        return next();
      }

      // Para otros roles, verificar si están en los roles permitidos
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      }
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
