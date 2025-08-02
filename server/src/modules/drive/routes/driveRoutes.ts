import { Router } from 'express';
import DriveController from '../controllers/driveController';
import {
  uploadFileValidations,
  updateFileValidations,
  fileIdValidations,
  listFilesValidations,
  searchFilesValidations,
  createFolderValidations,
  moveFileValidations,
  changeVisibilityValidations
} from '../validations/driveValidations';
import {
  validateDriveConfiguration,
  initializeDriveService,
  uploadSingleFile,
  uploadMultipleFiles,
  handleMulterErrors,
  processSingleFile,
  processMultipleFiles,
  checkUserQuota,
  logFileOperation
} from '../middleware/driveMiddleware';
import {
  requireAuth,
  requireDrivePermission,
  requireDriveAdmin,
  requireDriveManager,
  requireDriveWrite,
  requireDriveDelete,
  logDriveActivity,
  checkRoleBasedLimits,
  DrivePermission
} from '../middleware/driveAuthMiddleware';

// Importar rutas de permisos
import drivePermissionsRoutes from './drivePermissionsRoutes';

const router = Router();

/**
 * Rutas para operaciones con Google Drive
 * Todas las rutas incluyen validaciones y middleware apropiados
 */

// ==================== SUBIDA DE ARCHIVOS ====================

/**
 * Sube un archivo único a Google Drive
 * POST /api/drive/upload
 * Requiere: Autenticación + Permisos de subida
 */
router.post('/upload',
  requireAuth,
  requireDrivePermission(DrivePermission.UPLOAD),
  validateDriveConfiguration,
  initializeDriveService,
  uploadSingleFile,
  handleMulterErrors,
  processSingleFile,
  checkRoleBasedLimits,
  checkUserQuota,
  logDriveActivity('upload'),
  uploadFileValidations,
  DriveController.uploadFile
);

/**
 * Sube múltiples archivos a Google Drive
 * POST /api/drive/upload/multiple
 * Requiere: Autenticación + Permisos de subida
 */
router.post('/upload/multiple',
  requireAuth,
  requireDrivePermission(DrivePermission.UPLOAD),
  validateDriveConfiguration,
  initializeDriveService,
  uploadMultipleFiles,
  handleMulterErrors,
  processMultipleFiles,
  checkRoleBasedLimits,
  checkUserQuota,
  logDriveActivity('upload_multiple'),
  uploadFileValidations,
  DriveController.uploadMultipleFiles
);

// ==================== GESTIÓN DE ARCHIVOS ====================

/**
 * Obtiene información de un archivo específico
 * GET /api/drive/files/:fileId
 * Requiere: Autenticación + Permisos de lectura
 */
router.get('/files/:fileId',
  requireAuth,
  requireDrivePermission(DrivePermission.READ),
  validateDriveConfiguration,
  fileIdValidations,
  logDriveActivity('get_file'),
  DriveController.getFile
);

/**
 * Actualiza metadatos de un archivo
 * PUT /api/drive/files/:fileId
 * Requiere: Autenticación + Permisos de edición
 */
router.put('/files/:fileId',
  requireAuth,
  requireDrivePermission(DrivePermission.EDIT),
  validateDriveConfiguration,
  updateFileValidations,
  logDriveActivity('update_file'),
  DriveController.updateFile
);

/**
 * Elimina un archivo de Google Drive
 * DELETE /api/drive/files/:fileId
 * Requiere: Autenticación + Permisos de eliminación
 */
router.delete('/files/:fileId',
  requireAuth,
  requireDriveDelete,
  validateDriveConfiguration,
  fileIdValidations,
  logDriveActivity('delete_file'),
  DriveController.deleteFile
);

/**
 * Lista archivos en una carpeta específica o raíz
 * GET /api/drive/files
 * Query params: folderId, pageSize, pageToken
 * Requiere: Autenticación + Permisos de lectura
 */
router.get('/files',
  requireAuth,
  requireDrivePermission(DrivePermission.READ),
  validateDriveConfiguration,
  listFilesValidations,
  logDriveActivity('list_files'),
  DriveController.listFiles
);

// ==================== BÚSQUEDA Y NAVEGACIÓN ====================

/**
 * Busca archivos por nombre
 * GET /api/drive/search
 * Query params: term, pageSize
 * Requiere: Autenticación + Permisos de lectura
 */
router.get('/search',
  requireAuth,
  requireDrivePermission(DrivePermission.READ),
  validateDriveConfiguration,
  searchFilesValidations,
  logDriveActivity('search_files'),
  DriveController.searchFiles
);

// ==================== GESTIÓN DE CARPETAS ====================

/**
 * Crea una nueva carpeta en Google Drive
 * POST /api/drive/folders
 * Requiere: Autenticación + Permisos de gestión
 */
router.post('/folders',
  requireAuth,
  requireDriveManager,
  validateDriveConfiguration,
  createFolderValidations,
  logDriveActivity('create_folder'),
  DriveController.createFolder
);

/**
 * Mueve un archivo a otra carpeta
 * POST /api/drive/files/:fileId/move
 * Requiere: Autenticación + Permisos de gestión
 */
router.post('/files/:fileId/move',
  requireAuth,
  requireDriveManager,
  validateDriveConfiguration,
  moveFileValidations,
  logDriveActivity('move_file'),
  DriveController.moveFile
);

// ==================== VISIBILIDAD Y PERMISOS ====================

/**
 * Cambia la visibilidad de un archivo (público/privado)
 * POST /api/drive/files/:fileId/visibility
 * Requiere: Autenticación + Permisos de administración
 */
router.post('/files/:fileId/visibility',
  requireAuth,
  requireDriveAdmin,
  validateDriveConfiguration,
  changeVisibilityValidations,
  logDriveActivity('change_visibility'),
  DriveController.changeFileVisibility
);

// ==================== INFORMACIÓN DEL SISTEMA ====================

/**
 * Obtiene información de almacenamiento de Google Drive
 * GET /api/drive/storage
 * Requiere: Autenticación + Permisos de administración
 */
router.get('/storage',
  requireAuth,
  requireDriveAdmin,
  validateDriveConfiguration,
  logDriveActivity('get_storage_info'),
  DriveController.getStorageInfo
);

/**
 * Obtiene tipos de archivo permitidos y configuración
 * GET /api/drive/allowed-types
 * Público - No requiere autenticación
 */
router.get('/allowed-types',
  DriveController.getAllowedFileTypes
);

// ==================== RUTAS PÚBLICAS PARA ENLACES COMPARTIDOS ====================

/**
 * Obtiene información básica de un archivo compartido (solo metadatos públicos)
 * GET /api/drive/public/files/:fileId
 * Público - No requiere autenticación
 */
router.get('/public/files/:fileId',
  validateDriveConfiguration,
  fileIdValidations,
  DriveController.getPublicFile
);

/**
 * Obtiene enlace de descarga directa para archivos públicos
 * GET /api/drive/public/files/:fileId/download
 * Público - No requiere autenticación  
 */
router.get('/public/files/:fileId/download',
  validateDriveConfiguration,
  fileIdValidations,
  DriveController.getPublicDownloadLink
);

// ==================== RUTAS DE PERMISOS ====================

/**
 * Incluir todas las rutas de gestión de permisos
 * Ruta base: /api/drive/permissions
 */
router.use('/permissions', drivePermissionsRoutes);

export default router;
