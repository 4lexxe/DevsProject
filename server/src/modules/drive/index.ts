/**
 * Módulo principal de Google Drive para gestión de archivos
 * 
 * Este módulo proporciona integración completa con Google Drive API
 * incluyendo gestión de archivos, permisos basados en roles, y 
 * control de acceso granular para contenido educativo.
 * 
 * Características principales:
 * - Subida y descarga de archivos
 * - Gestión de carpetas y organización
 * - Sistema de permisos basado en roles de usuario
 * - Controles de cuota y límites por usuario
 * - Búsqueda y filtrado de contenido
 * - Enlaces públicos compartibles
 * - Auditoría completa de operaciones
 * 
 * @author DevSpace Team
 * @version 1.0.0
 */

// Configuración
export * from './config/driveConfig';

// Servicios
export { default as DriveService } from './services/driveService';

// Validaciones
export * from './validations/driveValidations';

// Middleware de archivos
export * from './middleware/driveMiddleware';

// Middleware de autenticación y autorización
export {
  requireAuth,
  requireDrivePermission,
  requireDriveAdmin,
  requireDriveManager,
  requireDriveWrite,
  requireDriveDelete,
  logDriveActivity,
  checkRoleBasedLimits,
  DrivePermission,
  DriveRoles,
  type UserWithDrivePermissions
} from './middleware/driveAuthMiddleware';

// Controladores
export { default as DriveController } from './controllers/driveController';
export { default as DrivePermissionsController } from './controllers/drivePermissionsController';

// Rutas
export { default as driveRoutes } from './routes/driveRoutes';
export { default as drivePermissionsRoutes } from './routes/drivePermissionsRoutes';

// Tipos útiles para integración
export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  createdTime: string;
  modifiedTime: string;
}

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  webViewLink: string;
  webContentLink: string;
  success: boolean;
  message: string;
}

export interface DriveSearchFilters {
  name?: string;
  mimeType?: string;
  parentId?: string;
  createdAfter?: string;
  createdBefore?: string;
  modifiedAfter?: string;
  modifiedBefore?: string;
  limit?: number;
  orderBy?: 'name' | 'createdTime' | 'modifiedTime' | 'size';
  orderDirection?: 'asc' | 'desc';
}

export interface DrivePermissionSummary {
  userId: string;
  role: string;
  permissions: string[];
  canRead: boolean;
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
  isAdmin: boolean;
  maxFileSize: number;
  dailyQuota: number;
}

/**
 * Endpoints disponibles en el módulo Drive
 */
export const DRIVE_ENDPOINTS = {
  // Gestión de archivos
  UPLOAD: 'POST /api/drive/files/upload',
  DOWNLOAD: 'GET /api/drive/files/:fileId/download',
  DELETE: 'DELETE /api/drive/files/:fileId',
  UPDATE: 'PUT /api/drive/files/:fileId',
  LIST: 'GET /api/drive/files',
  SEARCH: 'GET /api/drive/files/search',
  
  // Gestión de carpetas
  CREATE_FOLDER: 'POST /api/drive/folders',
  MOVE_FILE: 'PUT /api/drive/files/:fileId/move',
  
  // Enlaces públicos
  GET_PUBLIC_LINK: 'GET /api/drive/files/:fileId/public-link',
  PUBLIC_DOWNLOAD: 'GET /api/drive/public/files/:fileId/download',
  
  // Gestión de permisos
  MY_PERMISSIONS: 'GET /api/drive/permissions/me',
  USER_PERMISSIONS: 'GET /api/drive/permissions/user/:userId',
  UPDATE_PERMISSIONS: 'PUT /api/drive/permissions/user/:userId',
  CHECK_FILE_ACCESS: 'GET /api/drive/permissions/file/:fileId/access',
  ROLES_INFO: 'GET /api/drive/permissions/roles',
  PERMISSION_STATS: 'GET /api/drive/permissions/stats'
} as const;

/**
 * Información de roles y permisos del sistema
 */
export const DRIVE_ROLES_INFO = {
  VIEWER: {
    description: 'Solo lectura - puede ver y descargar archivos',
    permissions: ['drive:read'],
    maxFileSize: 0,
    dailyQuota: 0
  },
  CONTRIBUTOR: {
    description: 'Puede subir archivos pequeños',
    permissions: ['drive:read', 'drive:upload'],
    maxFileSize: 10,
    dailyQuota: 100
  },
  EDITOR: {
    description: 'Puede editar y subir archivos medianos',
    permissions: ['drive:read', 'drive:upload', 'drive:edit'],
    maxFileSize: 50,
    dailyQuota: 500
  },
  MODERATOR: {
    description: 'Control completo excepto gestión de usuarios',
    permissions: ['drive:read', 'drive:upload', 'drive:edit', 'drive:delete'],
    maxFileSize: 200,
    dailyQuota: 2000
  },
  ADMIN: {
    description: 'Control total del sistema incluyendo gestión de permisos',
    permissions: ['drive:read', 'drive:upload', 'drive:edit', 'drive:delete', 'drive:manage', 'drive:admin'],
    maxFileSize: -1, // Sin límite
    dailyQuota: -1   // Sin límite
  }
} as const;
