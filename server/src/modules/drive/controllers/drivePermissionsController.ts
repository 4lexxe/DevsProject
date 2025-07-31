import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { 
  getUserDrivePermissions, 
  DrivePermission, 
  DriveRoles,
  hasPermission,
  canAccessFile,
  canModifyFile
} from '../middleware/driveAuthMiddleware';

/**
 * Controlador para gestión de permisos de Google Drive
 * Maneja la asignación y verificación de permisos de usuarios
 */
export class DrivePermissionsController extends BaseController {

  /**
   * Obtiene los permisos de Drive del usuario autenticado
   * GET /api/drive/permissions/me
   */
  static getMyPermissions = this.asyncHandler(async (req: Request, res: Response) => {
    const user = this.getUser(req);
    
    if (!user) {
      return this.unauthorized(res, req);
    }

    const permissions = getUserDrivePermissions(user);
    
    this.sendSuccess(res, req, {
      userId: user.id,
      userRole: user.role,
      drivePermissions: permissions,
      capabilities: {
        canRead: hasPermission(user, DrivePermission.READ),
        canUpload: hasPermission(user, DrivePermission.UPLOAD),
        canEdit: hasPermission(user, DrivePermission.EDIT),
        canDelete: hasPermission(user, DrivePermission.DELETE),
        canManage: hasPermission(user, DrivePermission.MANAGE),
        canAdmin: hasPermission(user, DrivePermission.ADMIN)
      },
      roleInfo: {
        availableRoles: Object.keys(DriveRoles),
        currentRolePermissions: DriveRoles[user.role?.toUpperCase() as keyof typeof DriveRoles] || DriveRoles.VIEWER
      }
    }, 'Permisos de Drive obtenidos exitosamente');
  });

  /**
   * Obtiene los permisos de Drive de un usuario específico
   * GET /api/drive/permissions/user/:userId
   * Requiere: Permisos de administración
   */
  static getUserPermissions = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const currentUser = this.getUser(req);
    const targetUserId = req.params.userId;

    if (!hasPermission(currentUser, DrivePermission.ADMIN)) {
      return this.forbidden(res, req, 'Solo los administradores pueden ver permisos de otros usuarios');
    }

    // Aquí normalmente buscarías el usuario en la base de datos
    // Para este ejemplo, simulamos la respuesta
    const targetUser = { id: targetUserId, role: 'user' }; // Placeholder

    const permissions = getUserDrivePermissions(targetUser);

    this.sendSuccess(res, req, {
      userId: targetUser.id,
      userRole: targetUser.role,
      drivePermissions: permissions,
      capabilities: {
        canRead: hasPermission(targetUser, DrivePermission.READ),
        canUpload: hasPermission(targetUser, DrivePermission.UPLOAD),
        canEdit: hasPermission(targetUser, DrivePermission.EDIT),
        canDelete: hasPermission(targetUser, DrivePermission.DELETE),
        canManage: hasPermission(targetUser, DrivePermission.MANAGE),
        canAdmin: hasPermission(targetUser, DrivePermission.ADMIN)
      }
    }, 'Permisos de usuario obtenidos exitosamente');
  });

  /**
   * Verifica si el usuario puede acceder a un archivo específico
   * GET /api/drive/permissions/file/:fileId/access
   */
  static checkFileAccess = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const user = this.getUser(req);
    const fileId = req.params.fileId;
    const fileOwnerId = req.query.ownerId as string; // Opcional

    if (!user) {
      return this.unauthorized(res, req);
    }

    const canAccess = canAccessFile(user, fileOwnerId);
    const canModify = canModifyFile(user, fileOwnerId);

    this.sendSuccess(res, req, {
      fileId,
      userId: user.id,
      permissions: {
        canAccess,
        canModify,
        canRead: canAccess,
        canEdit: canModify && hasPermission(user, DrivePermission.EDIT),
        canDelete: canModify && hasPermission(user, DrivePermission.DELETE)
      },
      userPermissions: getUserDrivePermissions(user)
    }, 'Permisos de archivo verificados exitosamente');
  });

  /**
   * Obtiene información sobre roles y permisos disponibles
   * GET /api/drive/permissions/roles
   */
  static getAvailableRoles = this.asyncHandler(async (req: Request, res: Response) => {
    const user = this.getUser(req);

    if (!user) {
      return this.unauthorized(res, req);
    }

    // Solo los administradores pueden ver todos los roles disponibles
    if (!hasPermission(user, DrivePermission.ADMIN)) {
      return this.forbidden(res, req, 'Solo los administradores pueden ver información de roles');
    }

    this.sendSuccess(res, req, {
      roles: DriveRoles,
      permissions: Object.values(DrivePermission),
      roleDescriptions: {
        VIEWER: 'Solo puede ver archivos y enlaces compartidos',
        CONTRIBUTOR: 'Puede ver y subir archivos',
        EDITOR: 'Puede ver, subir y editar archivos',
        MODERATOR: 'Puede ver, subir, editar y eliminar archivos',
        ADMIN: 'Control total sobre Drive: gestión completa de archivos y permisos'
      },
      permissionDescriptions: {
        [DrivePermission.READ]: 'Ver archivos y obtener enlaces',
        [DrivePermission.UPLOAD]: 'Subir nuevos archivos',
        [DrivePermission.EDIT]: 'Editar metadatos de archivos',
        [DrivePermission.DELETE]: 'Eliminar archivos',
        [DrivePermission.MANAGE]: 'Gestionar carpetas y organización',
        [DrivePermission.ADMIN]: 'Administración completa del sistema'
      }
    }, 'Información de roles y permisos obtenida exitosamente');
  });

  /**
   * Actualiza los permisos de Drive de un usuario (solo admins)
   * PUT /api/drive/permissions/user/:userId
   * Requiere: Permisos de administración
   */
  static updateUserPermissions = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const currentUser = this.getUser(req);
    const targetUserId = req.params.userId;
    const { role, customPermissions } = req.body;

    if (!hasPermission(currentUser, DrivePermission.ADMIN)) {
      return this.forbidden(res, req, 'Solo los administradores pueden modificar permisos');
    }

    // Validar que el rol sea válido
    if (role && !Object.keys(DriveRoles).includes(role.toUpperCase())) {
      return this.sendError(res, req, 'Rol no válido', 400, {
        validRoles: Object.keys(DriveRoles)
      });
    }

    // Validar permisos personalizados
    if (customPermissions && Array.isArray(customPermissions)) {
      const invalidPermissions = customPermissions.filter(
        perm => !Object.values(DrivePermission).includes(perm)
      );

      if (invalidPermissions.length > 0) {
        return this.sendError(res, req, 'Permisos no válidos', 400, {
          invalidPermissions,
          validPermissions: Object.values(DrivePermission)
        });
      }
    }

    // Aquí normalmente actualizarías la base de datos
    // Para este ejemplo, simulamos la respuesta
    const updatedUser = {
      id: targetUserId,
      role: role || 'user',
      drivePermissions: customPermissions || null
    };

    const newPermissions = getUserDrivePermissions(updatedUser);

    this.logActivity(req, 'UPDATE_USER_PERMISSIONS', 'DrivePermissions', {
      targetUserId,
      oldRole: 'previous_role', // Placeholder
      newRole: role,
      customPermissions,
      newPermissions
    });

    this.sendSuccess(res, req, {
      userId: targetUserId,
      updatedRole: updatedUser.role,
      newPermissions,
      capabilities: {
        canRead: hasPermission(updatedUser, DrivePermission.READ),
        canUpload: hasPermission(updatedUser, DrivePermission.UPLOAD),
        canEdit: hasPermission(updatedUser, DrivePermission.EDIT),
        canDelete: hasPermission(updatedUser, DrivePermission.DELETE),
        canManage: hasPermission(updatedUser, DrivePermission.MANAGE),
        canAdmin: hasPermission(updatedUser, DrivePermission.ADMIN)
      }
    }, 'Permisos de usuario actualizados exitosamente');
  });

  /**
   * Obtiene estadísticas de uso por rol
   * GET /api/drive/permissions/stats
   * Requiere: Permisos de administración
   */
  static getPermissionStats = this.asyncHandler(async (req: Request, res: Response) => {
    const user = this.getUser(req);

    if (!hasPermission(user, DrivePermission.ADMIN)) {
      return this.forbidden(res, req, 'Solo los administradores pueden ver estadísticas');
    }

    // Aquí normalmente consultarías la base de datos para obtener estadísticas reales
    // Para este ejemplo, simulamos datos
    const stats = {
      totalUsers: 150,
      usersByRole: {
        VIEWER: 80,
        CONTRIBUTOR: 35,
        EDITOR: 20,
        MODERATOR: 10,
        ADMIN: 5
      },
      activeUsers: {
        lastDay: 45,
        lastWeek: 95,
        lastMonth: 135
      },
      driveUsage: {
        totalFiles: 1250,
        totalSize: '45.2 GB',
        filesByRole: {
          ADMIN: { files: 300, size: '15.2 GB' },
          MODERATOR: { files: 250, size: '12.8 GB' },
          EDITOR: { files: 400, size: '10.5 GB' },
          CONTRIBUTOR: { files: 200, size: '4.2 GB' },
          VIEWER: { files: 100, size: '2.5 GB' }
        }
      }
    };

    this.sendSuccess(res, req, stats, 'Estadísticas de permisos obtenidas exitosamente');
  });
}

export default DrivePermissionsController;
