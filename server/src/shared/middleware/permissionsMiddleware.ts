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
      // Obtener el rol del usuario con sus permisos
      const role = await user.getRole({
        include: [
          {
            model: Permission,
            as: "Permissions",
            attributes: ["id", "name"],
          },
        ],
      });

      console.log("Rol obtenido:", role);

      if (!role || !role.Permissions) {
        throw new Error("El rol del usuario no tiene permisos");
      }

      // Obtener permisos personalizados del usuario
      const userPermissions = await user.getPermissions() || [];
      console.log("Permisos personalizados del usuario:", userPermissions);

      // Obtener permisos bloqueados del usuario
      const blockedPermissionsRaw = await UserPermissionException.findAll({
        where: {
          userId: user.id,
          permissionId: { [Op.not]: null }, // Asegurar que permissionId no sea null
        },
        include: [
          {
            model: Permission,
            as: "Permission",
            attributes: ["id", "name"],
          },
        ],
      });

      console.log("Permisos bloqueados crudos:", blockedPermissionsRaw);

      // Filtrar solo registros válidos con un `permissionId` definido
      const blockedPermissions = blockedPermissionsRaw.filter(bp => bp.permissionId != null);
      console.log("Permisos bloqueados filtrados:", blockedPermissions);

      // Combinar permisos del rol y permisos personalizados
      const rolePermissions = role?.Permissions?.map((p) => p.name) || [];
      const customPermissions = userPermissions.map((p) => p.name);
      const allPermissions = [...rolePermissions, ...customPermissions];

      console.log("Permisos combinados (rol + personalizados):", allPermissions);

      // Filtrar permisos bloqueados
      const blockedPermissionNames = blockedPermissions
        .filter((blocked) => blocked.Permission) // Filtrar solo registros con Permission válido
        .map((blocked) => blocked.Permission?.name);

      console.log("Permisos bloqueados por nombre:", blockedPermissionNames);

      // Verificar si el usuario tiene los permisos necesarios
      const hasPermissions = requiredPermissions.every((permission) => {
        // Verificar si el permiso está bloqueado
        if (blockedPermissionNames && blockedPermissionNames.includes(permission)) {
          return false; // Permiso bloqueado, denegar acceso
        }
        // Verificar si el usuario tiene el permiso
        return allPermissions.includes(permission);
      });

      if (!hasPermissions) {
        res.status(403).json({
          message: "Acceso denegado",
          details: `No tienes los permisos de ${requiredPermissions.join(", ")}`,
        });
        return;
      }

      next(); // El usuario tiene los permisos necesarios, continuar
    } catch (error) {
      console.error("Error verificando permisos:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Ocurrió un error al verificar los permisos",
      });
    }
  };
};