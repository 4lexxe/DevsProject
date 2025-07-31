import { Router } from 'express';
import DrivePermissionsController from '../controllers/drivePermissionsController';
import { param, body } from 'express-validator';
import {
  requireAuth,
  requireDriveAdmin,
  DrivePermission
} from '../middlewares/driveAuthMiddleware';

const router = Router();

/**
 * Rutas para gestión de permisos de Google Drive
 * Todas las rutas requieren autenticación básica
 */

// ==================== PERMISOS PROPIOS ====================

/**
 * Obtiene los permisos de Drive del usuario autenticado
 * GET /api/drive/permissions/me
 */
router.get('/me',
  requireAuth,
  DrivePermissionsController.getMyPermissions
);

// ==================== GESTIÓN DE PERMISOS (SOLO ADMINS) ====================

/**
 * Obtiene los permisos de Drive de un usuario específico
 * GET /api/drive/permissions/user/:userId
 */
router.get('/user/:userId',
  requireAuth,
  requireDriveAdmin,
  [
    param('userId')
      .notEmpty()
      .withMessage('El ID del usuario es requerido')
      .isString()
      .withMessage('El ID del usuario debe ser una cadena')
  ],
  DrivePermissionsController.getUserPermissions
);

/**
 * Actualiza los permisos de Drive de un usuario
 * PUT /api/drive/permissions/user/:userId
 */
router.put('/user/:userId',
  requireAuth,
  requireDriveAdmin,
  [
    param('userId')
      .notEmpty()
      .withMessage('El ID del usuario es requerido')
      .isString()
      .withMessage('El ID del usuario debe ser una cadena'),
    
    body('role')
      .optional()
      .isString()
      .withMessage('El rol debe ser una cadena')
      .isIn(['VIEWER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN'])
      .withMessage('Rol no válido'),
    
    body('customPermissions')
      .optional()
      .isArray()
      .withMessage('Los permisos personalizados deben ser un array')
      .custom((permissions) => {
        if (permissions && permissions.length > 0) {
          const validPermissions = Object.values(DrivePermission);
          const invalidPerms = permissions.filter((perm: string) => !validPermissions.includes(perm as DrivePermission));
          if (invalidPerms.length > 0) {
            throw new Error(`Permisos no válidos: ${invalidPerms.join(', ')}`);
          }
        }
        return true;
      })
  ],
  DrivePermissionsController.updateUserPermissions
);

// ==================== VERIFICACIÓN DE ACCESO ====================

/**
 * Verifica si el usuario puede acceder a un archivo específico
 * GET /api/drive/permissions/file/:fileId/access
 */
router.get('/file/:fileId/access',
  requireAuth,
  [
    param('fileId')
      .notEmpty()
      .withMessage('El ID del archivo es requerido')
      .isString()
      .withMessage('El ID del archivo debe ser una cadena')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('El ID del archivo contiene caracteres no válidos')
  ],
  DrivePermissionsController.checkFileAccess
);

// ==================== INFORMACIÓN DEL SISTEMA ====================

/**
 * Obtiene información sobre roles y permisos disponibles
 * GET /api/drive/permissions/roles
 */
router.get('/roles',
  requireAuth,
  requireDriveAdmin,
  DrivePermissionsController.getAvailableRoles
);

/**
 * Obtiene estadísticas de uso por rol
 * GET /api/drive/permissions/stats
 */
router.get('/stats',
  requireAuth,
  requireDriveAdmin,
  DrivePermissionsController.getPermissionStats
);

export default router;
