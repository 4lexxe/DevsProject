import { Request, Response, NextFunction } from "express";
import User from "../../modules/user/User";
import UserPermissionException from "../../modules/user/UserPermissionExceptions";
import Permission from "../../modules/Permission/Permission";
import { Op } from "sequelize";

export const permissionsMiddleware = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as User;
    if (!user || !user.id) {
      res.status(401).json({
        message: "Usuario no autenticado",
        details: "No se encontró al usuario o el usuario no es válido",
      });
      return;
    }

    try {
      // Primero verificar permisos bloqueados
      const blockedPermissionsRaw = await UserPermissionException.findAll({
        where: {
          userId: user.id,
          permissionId: { [Op.not]: null },
        },
        include: [
          {
            model: Permission,
            as: "Permission",
            attributes: ["id", "name"],
          },
        ],
      });

      // Obtener nombres de permisos bloqueados
      const blockedPermissionNames = blockedPermissionsRaw
        .filter(bp => bp.Permission)
        .map(bp => bp.Permission?.name);

      // Verificar si alguno de los permisos requeridos está bloqueado
      const hasBlockedPermission = requiredPermissions.some(
        permission => blockedPermissionNames.includes(permission)
      );

      if (hasBlockedPermission) {
        res.status(403).json({
          message: "Acceso denegado",
          details: "Tienes permisos bloqueados que son necesarios para esta acción",
        });
        return;
      }

      // Si no hay bloqueos, verificar permisos disponibles
      const role = await user.getRole({
        include: [
          {
            model: Permission,
            as: "Permissions",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!role || !role.Permissions) {
        throw new Error("El rol del usuario no tiene permisos configurados");
      }

      // Obtener permisos personalizados
      const userPermissions = await user.getPermissions() || [];

      // Combinar permisos del rol y personalizados
      const rolePermissions = role.Permissions.map(p => p.name);
      const customPermissions = userPermissions.map(p => p.name);
      const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];

      // Verificar si tiene todos los permisos requeridos
      const hasRequiredPermissions = requiredPermissions.every(
        permission => allPermissions.includes(permission)
      );

      if (!hasRequiredPermissions) {
        res.status(403).json({
          message: "Acceso denegado",
          details: `No tienes los permisos necesarios: ${requiredPermissions.join(", ")}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error verificando permisos:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error al verificar permisos",
      });
    }
  };
};