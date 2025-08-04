import { Router } from 'express';
import { ContentFilesController } from '../controllers/contentFiles.controller';
import { 
  validateContentId, 
  validateFileId, 
  validateUpdateFile, 
  validateToggleVisibility,
  validateFileUpload 
} from '../validations/contentFilesValidations';

import { 
  uploadMultipleFiles
} from '../../drive/middlewares/driveMiddleware';

const router = Router();

/**
 * @route   GET /api/contents/:contentId/files
 * @desc    Obtiene todos los archivos de un contenido específico
 * @access  Private (Admin/SuperAdmin)
 */
router.get(
  '/contents/:contentId/files',
  validateContentId,
  ContentFilesController.getContentFiles
);

/**
 * @route   GET /api/content-files/:fileId
 * @desc    Obtiene un archivo específico por ID
 * @access  Private (Admin/SuperAdmin)
 */
router.get(
  '/content-files/:fileId',
  validateFileId,
  ContentFilesController.getFileById
);

/**
 * @route   PUT /api/contents/:contentId/files/reorder
 * @desc    Actualiza las posiciones de múltiples archivos
 * @access  Private (Admin/SuperAdmin)
 */
router.put(
  '/contents/:contentId/files/reorder',
  validateContentId,
  // TODO: Agregar validación específica para reorder cuando se necesite
  ContentFilesController.reorderFilesEndpoint
);

/**
 * @route   POST /api/contents/:contentId/files/upload
 * @desc    Sube uno o múltiples archivos a un contenido específico
 * @access  Private (Admin/SuperAdmin)
 */

router.post(
  '/contents/:contentId/files/upload',
  validateContentId,
  uploadMultipleFiles,
  validateFileUpload,
  ContentFilesController.uploadFiles
);

/**
 * @route   DELETE /api/content-files/:fileId
 * @desc    Elimina un archivo (tanto de Drive como de la base de datos)
 * @access  Private (Admin/SuperAdmin)
 */
router.delete(
  '/content-files/:fileId',
  validateFileId,
  ContentFilesController.deleteFile
);

export default router;
