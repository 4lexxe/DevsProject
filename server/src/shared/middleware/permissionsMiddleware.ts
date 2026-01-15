import type { Request, Response, NextFunction } from "express";
import User from "../../modules/user/User";
import Permission from "../../modules/rbac/models/Permission";

// Extender el tipo Request de Express para incluir nuestro modelo User
declare global {
  namespace Express {
    interface User extends InstanceType<typeof User> {}
  }
}

/**
 * Verifica si un usuario tiene un permiso específico
 * @param user - Usuario autenticado
 * @param permissionName - Nombre del permiso a verificar
 * @returns true si tiene el permiso, false en caso contrario
 */
export function hasPermission(user: Express.User | User | undefined, permissionName: string): boolean {
  if (!user) return false;

  const userRole = (user as any).Role;
  if (!userRole) return false;

  const permissions = userRole.Permissions || [];
  return permissions.some((p: Permission) => p.name === permissionName);
}

/**
 * Verifica si un usuario tiene TODOS los permisos especificados
 * @param user - Usuario autenticado
 * @param permissionNames - Array de nombres de permisos a verificar
 * @returns true si tiene todos los permisos, false en caso contrario
 */
export function hasAllPermissions(user: Express.User | User | undefined, permissionNames: string[]): boolean {
  if (!user || permissionNames.length === 0) return false;

  return permissionNames.every(permission => hasPermission(user, permission));
}

/**
 * Verifica si un usuario tiene AL MENOS UNO de los permisos especificados
 * @param user - Usuario autenticado
 * @param permissionNames - Array de nombres de permisos a verificar
 * @returns true si tiene al menos un permiso, false en caso contrario
 */
export function hasAnyPermission(user: Express.User | User | undefined, permissionNames: string[]): boolean {
  if (!user || permissionNames.length === 0) return false;

  return permissionNames.some(permission => hasPermission(user, permission));
}

/**
 * Middleware que requiere que el usuario tenga TODOS los permisos especificados
 * @param permissions - Lista de permisos requeridos
 * @returns Middleware de Express
 * 
 * @example
 *  Un solo permiso
 * router.get('/users', requirePermission('read:users'), userController.getAll);
 * 
 * @example
 *  Múltiples permisos (requiere TODOS)
 * router.post('/admin/settings', requirePermission('manage:system_settings', 'write:users'), adminController.updateSettings);
 */
export function requirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    // Verificar si el usuario está autenticado
    if (!user) {
      res.status(401).json({
        message: "No autenticado",
        details: "Debe iniciar sesión para acceder a este recurso"
      });
      return;
    }

    // Verificar si tiene todos los permisos requeridos
    const missingPermissions = permissions.filter(permission => !hasPermission(user, permission));

    if (missingPermissions.length > 0) {
      res.status(403).json({
        message: "Permiso denegado",
        details: `No tiene los permisos necesarios: ${missingPermissions.join(", ")}`,
        requiredPermissions: permissions,
        missingPermissions
      });
      return;
    }

    next();
  };
}

/**
 * Middleware que requiere que el usuario tenga AL MENOS UNO de los permisos especificados
 * @param permissions - Lista de permisos (necesita al menos uno)
 * @returns Middleware de Express
 * 
 * @example
 * // Cualquier permiso de moderación
 * router.delete('/content/:id', requireAnyPermission('moderate:content', 'delete:content', 'manage:system_settings'), contentController.delete);
 */
export function requireAnyPermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    // Verificar si el usuario está autenticado
    if (!user) {
      res.status(401).json({
        message: "No autenticado",
        details: "Debe iniciar sesión para acceder a este recurso"
      });
      return;
    }

    // Verificar si tiene al menos uno de los permisos
    if (!hasAnyPermission(user, permissions)) {
      res.status(403).json({
        message: "Permiso denegado",
        details: `Requiere al menos uno de estos permisos: ${permissions.join(", ")}`,
        requiredPermissions: permissions
      });
      return;
    }

    next();
  };
}

/**
 * Middleware que permite acceso solo si el usuario es el propietario del recurso
 * O tiene un permiso específico de administración
 * 
 * @param getUserIdFromResource - Función que extrae el ID del propietario del recurso
 * @param adminPermission - Permiso que permite acceso sin ser propietario
 * @returns Middleware de Express
 * 
 * @example
 * // Solo el dueño del recurso o un admin pueden modificarlo
 * router.put('/resources/:id', 
 *   requireOwnershipOrPermission(
 *     async (req) => {
 *       const resource = await Resource.findByPk(req.params.id);
 *       return resource?.userId;
 *     },
 *     'moderate:all_resources'
 *   ),
 *   resourceController.update
 * );
 */
export function requireOwnershipOrPermission(
  getUserIdFromResource: (req: Request) => Promise<number | undefined>,
  adminPermission: string
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        message: "No autenticado",
        details: "Debe iniciar sesión para acceder a este recurso"
      });
      return;
    }

    // Verificar si tiene el permiso de admin
    if (hasPermission(user, adminPermission)) {
      next();
      return;
    }

    // Verificar si es el propietario
    try {
      const resourceOwnerId = await getUserIdFromResource(req);
      
      if (!resourceOwnerId) {
        res.status(404).json({
          message: "Recurso no encontrado"
        });
        return;
      }

      if (user.id === resourceOwnerId) {
        next();
        return;
      }

      res.status(403).json({
        message: "Permiso denegado",
        details: "No tiene acceso a este recurso. Debe ser el propietario o tener permisos de administración."
      });
    } catch (error) {
      console.error("Error verificando propiedad del recurso:", error);
      res.status(500).json({
        message: "Error al verificar permisos"
      });
    }
  };
}

/**
 * Middleware condicional: aplica middleware solo si se cumple una condición
 * 
 * @param condition - Función que determina si aplicar el middleware
 * @param middleware - Middleware a aplicar si la condición es verdadera
 * @returns Middleware de Express
 * 
 * @example
 * // Solo requiere permiso si el curso es premium
 * router.get('/courses/:id/content',
 *   conditionalMiddleware(
 *     async (req) => {
 *       const course = await Course.findByPk(req.params.id);
 *       return course?.isPremium === true;
 *     },
 *     requirePermission('access:premium_content')
 *   ),
 *   courseController.getContent
 * );
 */
export function conditionalMiddleware(
  condition: (req: Request) => Promise<boolean> | boolean,
  middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shouldApply = await condition(req);
      
      if (shouldApply) {
        await middleware(req, res, next);
      } else {
        next();
      }
    } catch (error) {
      console.error("Error en middleware condicional:", error);
      res.status(500).json({
        message: "Error al verificar condición"
      });
    }
  };
}

// Exportar todo por defecto también
export default {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  requirePermission,
  requireAnyPermission,
  requireOwnershipOrPermission,
  conditionalMiddleware
};
