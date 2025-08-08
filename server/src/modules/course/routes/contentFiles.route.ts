import { Router } from 'express';
import { ContentFilesController } from '../controllers/contentFiles.controller';
import { 
  validateContentId, 
  validateFileId, 
  validateMultipleFiles
} from '../validators/contentFilesValidator';

import { 
  uploadMultipleFiles,
  validateFileSize
} from '../../drive/middlewares/driveMiddleware';

import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';

// Middleware para validar archivos subidos
const validateUploadedFilesMiddleware = (req: any, res: any, next: any) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No se han proporcionado archivos para subir'
    });
  }

  // Validar múltiples archivos
  const validation = validateMultipleFiles(req.files);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Error en la validación de archivos',
      errors: validation.errors
    });
  }

  next();
};

const router = Router();

/**
 * @route   GET /api/contents/:contentId/files
 * @desc    Obtiene todos los archivos de un contenido específico
 * @access  Private (Admin/SuperAdmin)
 */
router.get(
  '/contents/:contentId/files',
  authMiddleware,
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
  authMiddleware,
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
  authMiddleware,
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
  authMiddleware,
  validateContentId,
  uploadMultipleFiles,
  validateFileSize,
  validateUploadedFilesMiddleware,
  ContentFilesController.uploadFiles
);

/**
 * @route   DELETE /api/content-files/:fileId
 * @desc    Elimina un archivo (tanto de Drive como de la base de datos)
 * @access  Private (Admin/SuperAdmin)
 */
router.delete(
  '/content-files/:fileId',
  authMiddleware,
  validateFileId,
  ContentFilesController.deleteFile
);

export default router;
