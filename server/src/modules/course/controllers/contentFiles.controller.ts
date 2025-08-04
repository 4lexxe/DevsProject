import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import ContentFiles from '../models/ContentFiles';
import Content from '../models/Content';
import DriveService, { UploadFileOptions } from '../../drive/services/driveService';
/* import { FileUploadRequest } from '../../drive/middlewares/driveMiddleware'; */
import { sanitizeFileName } from '../../drive/validations/driveValidations';
import { Op, fn, col } from 'sequelize';
import fs from 'fs';

/**
 * Controlador para manejo de archivos de contenido usando Google Drive
 * Extiende BaseController para respuestas consistentes
 */
export class ContentFilesController extends BaseController {

  /**
   * Obtiene todos los archivos de un contenido específico
   * GET /api/contents/:contentId/files
   */
  static getContentFiles = this.asyncHandler(async (req: Request, res: Response) => {
    const contentId = this.getNumericParam(req, res, 'contentId');
    if (!contentId) return;

    // Verificar que el contenido existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return this.notFound(res, req, 'Contenido');
    }

    // Obtener archivos ordenados por posición
    const files = await ContentFiles.findAll({
      where: { contentId },
      order: [['position', 'ASC'], ['createdAt', 'ASC']],
      attributes: [
        'id', 'contentId', 'fileName', 'originalName', 'fileType', 
        'fileSize', 'mimeType', 'driveFileId', 'driveUrl', 
        'thumbnailLink', 'driveWebViewLink', 'driveWebContentLink', 'description', 
        'isPublic', 'allowDownload', 'position', 'createdAt', 'updatedAt'
      ]
    });

    this.sendSuccess(res, req, files, `Archivos del contenido obtenidos exitosamente (${files.length} archivos)`);
  });

  /**
   * Obtiene un archivo específico por ID
   * GET /api/content-files/:fileId
   */
  static getFileById = this.asyncHandler(async (req: Request, res: Response) => {
    const fileId = req.params.fileId;
    if (!fileId) {
      return this.sendError(res, req, 'ID de archivo requerido', 400);
    }

    const file = await ContentFiles.findByPk(fileId, {
      include: [{
        model: Content,
        as: 'content',
        attributes: ['id', 'title', 'sectionId']
      }]
    });

    if (!file) {
      return this.notFound(res, req, 'Archivo');
    }

    this.sendSuccess(res, req, file, 'Archivo obtenido exitosamente');
  });

  /**
   * Sube uno o múltiples archivos a un contenido específico
   * POST /api/contents/:contentId/files/upload
   */
  static uploadFiles = this.asyncHandler(async (req: any, res: Response) => {
    // Validar errores de express-validator
    if (!this.handleValidationErrors(req, res)) return;

    const contentId = this.getNumericParam(req, res, 'contentId');
    if (!contentId) return;

    // Verificar que el contenido existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return this.notFound(res, req, 'Contenido');
    }

    // Verificar que hay archivos para procesar
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return this.sendError(res, req, 'No se encontraron archivos para subir', 400);
    }

    const userId = this.getUserId(req);
    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    const { descriptions = [], isPublic = true, allowDownload = false } = req.body;
    const uploadedFiles: ContentFiles[] = [];
    const errors: any[] = [];

    // Crear instancia del servicio de Drive
    const driveService = new DriveService();

    // Obtener la siguiente posición disponible
    const maxPosition = await ContentFiles.max('position', {
      where: { contentId }
    }) as number || 0;
    
    // Procesar cada archivo
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const description = Array.isArray(descriptions) ? descriptions[i] : descriptions;
      
      try {
        console.log(`📤 Procesando archivo ${i + 1}/${req.files.length}: ${file.originalname}`);
        
        // Verificar que el archivo temporal existe
        if (!file.path || !fs.existsSync(file.path)) {
          throw new Error(`Archivo temporal no encontrado: ${file.path}`);
        }
        
        // Preparar opciones de subida
        const uploadOptions: UploadFileOptions = {
          name: sanitizeFileName(file.originalname),
          description: description || `Archivo subido: ${file.originalname}`
        };
        
        // Subir archivo a Google Drive
        const uploadResult = await driveService.uploadFileFromPath(
          file.path,
          file.mimetype,
          uploadOptions
        );
        
        if (!uploadResult.success || !uploadResult.file) {

          throw new Error(uploadResult.error || 'Error desconocido al subir archivo a Drive');
        }

        const driveFile = uploadResult.file;

        // Determinar el tipo de archivo
        const fileType = this.determineFileType(file.mimetype);
        
        // Determinar si se permite descarga basado en configuración del usuario
        const shouldAllowDownload = false; // Por defecto false (no descarga)

        // Preparar URLs basadas en permisos de descarga
        let driveWebContentLink: string | undefined = undefined;
        let driveUrl = uploadResult.shareableLink || driveFile.webViewLink || `https://drive.google.com/file/d/${driveFile.id}/view`; // Usar shareableLink público
        
        // Generar drivePreviewLink público que no requiere autenticación
        const publicPreviewLink = uploadResult.shareableLink 
          ? `https://drive.google.com/file/d/${driveFile.id}/preview?usp=sharing`
          : `https://drive.google.com/file/d/${driveFile.id}/preview`;
        
        if (shouldAllowDownload) {
          // Si se permite descarga, guardar el enlace de descarga directa
          // NOTA: Esto solo funcionará si se deshabilitan las restricciones máximas en Drive
          driveWebContentLink = driveFile.webContentLink;
        } else {
          // Si no se permite descarga, usar solo enlace público de vista/preview 
          // Los archivos tienen restricciones máximas: sin descarga, copia ni impresión
          driveUrl = uploadResult.shareableLink || driveFile.webViewLink || `https://drive.google.com/file/d/${driveFile.id}/view`;
        }

        // Crear registro en la base de datos
        const contentFile = await ContentFiles.create({
          contentId: BigInt(contentId),
          fileName: sanitizeFileName(file.originalname),
          originalName: file.originalname,
          fileType,
          fileSize: file.size,
          mimeType: file.mimetype,
          driveFileId: driveFile.id,
          driveUrl: driveUrl,
          thumbnailLink: driveFile.thumbnailLink,
          driveWebViewLink: driveFile.webViewLink,
          driveWebContentLink: driveWebContentLink, // Solo se guarda si se permite descarga
          drivePreviewLink: publicPreviewLink, // URL de preview público que no requiere autenticación
          description,
          isPublic: Boolean(isPublic),
          allowDownload: shouldAllowDownload,
          uploadedBy: BigInt(userId),
          position: maxPosition + i + 1
        });
        
        uploadedFiles.push(contentFile);
        console.log(`✅ Archivo guardado en BD: ${file.originalname} (ID: ${contentFile.id})`);

      } catch (error) {
        console.error(`❌ Error al procesar archivo ${file.originalname}:`, error);
        
        // Crear un mensaje de error más descriptivo
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Casos específicos de error
          if (error.message.includes('Validation')) {
            errorMessage = 'Error de validación de datos';
          } else if (error.message.includes('Connection')) {
            errorMessage = 'Error de conexión con la base de datos';
          }
        }
        
        errors.push({
          fileName: file.originalname,
          error: errorMessage,
          timestamp: new Date().toISOString()
        });
      } finally {
        // Limpiar archivo temporal
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
            console.log(`🧹 Archivo temporal limpiado: ${file.path}`);
          } catch (cleanupError) {
            console.warn(`⚠️ No se pudo limpiar archivo temporal: ${file.path}`, cleanupError);
          }
        }
      }
    }

    // Preparar respuesta
    const response = {
      uploadedFiles: uploadedFiles.length,
      totalFiles: req.files.length,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        success: uploadedFiles.length,
        failed: errors.length,
        total: req.files.length,
        successRate: `${Math.round((uploadedFiles.length / req.files.length) * 100)}%`
      }
    };

    if (uploadedFiles.length === 0) {
      return this.sendError(res, req, 'No se pudo procesar ningún archivo', 400, { errors });
    } else if (errors.length > 0) {
      return this.sendSuccess(res, req, response, 
        `${uploadedFiles.length} archivo(s) procesado(s) exitosamente, ${errors.length} archivo(s) con errores`, 207);
    } else {
      return this.created(res, req, response, 
        `${uploadedFiles.length} archivo(s) subido(s) exitosamente`);
    }
  });

  /**
   * Actualiza únicamente la posición de un archivo
   * PUT /api/content-files/:fileId/position
   */
  static updateFilePosition = this.asyncHandler(async (req: Request, res: Response) => {
    const fileId = req.params.fileId;
    if (!fileId) {
      return this.sendError(res, req, 'ID de archivo requerido', 400);
    }

    const { position } = req.body;

    if (typeof position !== 'number' || position < 1) {
      return this.sendError(res, req, 'La posición debe ser un número mayor a 0', 400);
    }

    const file = await ContentFiles.findByPk(fileId);
    if (!file) {
      return this.notFound(res, req, 'Archivo');
    }

    // Actualizar posición
    await file.update({ position });

    this.updated(res, req, file, 'Posición del archivo actualizada exitosamente');
    this.logActivity(req, 'UPDATE_FILE_POSITION', 'ContentFile', { fileId, position });
  });

  /**
   * Actualiza las posiciones de múltiples archivos de forma masiva
   * PUT /api/contents/:contentId/files/reorder
   */
  static reorderFilesEndpoint = this.asyncHandler(async (req: Request, res: Response) => {
    const contentId = this.getNumericParam(req, res, 'contentId');
    if (!contentId) return;

    const { fileOrders } = req.body;

    // Validar que fileOrders existe y es un array
    if (!Array.isArray(fileOrders) || fileOrders.length === 0) {
      return this.sendError(res, req, 'fileOrders debe ser un array con al menos un elemento', 400);
    }

    // Verificar que el contenido existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return this.notFound(res, req, 'Contenido');
    }

    // Validar formato de cada elemento en fileOrders
    for (const order of fileOrders) {
      if (!order.fileId || typeof order.fileId !== 'string' || typeof order.position !== 'number' || order.position < 1) {
        return this.sendError(res, req, 'Cada elemento debe tener fileId (string UUID) y position (número mayor a 0)', 400);
      }
    }

    try {
      // Extraer IDs de archivos para verificar que existen y pertenecen al contenido
      const fileIds = fileOrders.map(order => order.fileId);
      const files = await ContentFiles.findAll({
        where: {
          id: fileIds,
          contentId: contentId
        }
      });

      // Verificar que todos los archivos existen y pertenecen al contenido
      if (files.length !== fileOrders.length) {
        return this.sendError(res, req, 'Uno o más archivos no existen o no pertenecen a este contenido', 400);
      }

      // Actualizar posiciones en lote usando transacción
      const updatedFiles: ContentFiles[] = [];
      
      // Usar transacción para asegurar consistencia
      await ContentFiles.sequelize!.transaction(async (transaction) => {
        for (const order of fileOrders) {
          const file = files.find(f => f.id === order.fileId);
          if (file) {
            await file.update(
              { position: order.position },
              { transaction }
            );
            updatedFiles.push(file);
          }
        }
      });

      // Obtener archivos actualizados ordenados por posición
      const reorderedFiles = await ContentFiles.findAll({
        where: { contentId },
        order: [['position', 'ASC'], ['createdAt', 'ASC']],
        attributes: [
          'id', 'contentId', 'fileName', 'originalName', 'fileType', 
          'fileSize', 'mimeType', 'driveFileId', 'driveUrl', 
          'thumbnailLink', 'driveWebViewLink', 'driveWebContentLink', 'description', 
          'isPublic', 'allowDownload', 'position', 'createdAt', 'updatedAt'
        ]
      });

      this.sendSuccess(res, req, reorderedFiles, `${updatedFiles.length} archivo(s) reordenado(s) exitosamente`);
      this.logActivity(req, 'REORDER_FILES', 'ContentFile', { 
        contentId, 
        fileCount: updatedFiles.length,
        fileOrders: fileOrders.map(order => ({ fileId: order.fileId, position: order.position }))
      });

    } catch (error) {
      this.handleServerError(res, req, error, 'Error al reordenar archivos');
    }
  });

  /**
   * Elimina un archivo (tanto de Drive como de la base de datos)
   * DELETE /api/content-files/:fileId
   */
  static deleteFile = this.asyncHandler(async (req: any, res: Response) => {
    const fileId = req.params.fileId;
    if (!fileId) {
      return this.sendError(res, req, 'ID de archivo requerido', 400);
    }

    const file = await ContentFiles.findByPk(fileId);
    if (!file) {
      return this.notFound(res, req, 'Archivo');
    }

    try {
      // Crear instancia del servicio de Drive para eliminar el archivo
      const driveService = new DriveService();
      const driveDeleted = await driveService.deleteFile(file.driveFileId);
      
      if (!driveDeleted) {
        console.warn(`Warning: Could not delete file from Drive for file ID: ${file.driveFileId}`);
        // Continuar con la eliminación de la base de datos aunque falle en Drive
      }

      // Eliminar de la base de datos
      await file.destroy();

      // Reordenar archivos restantes
      await this.reorderFilesAfterDelete(file.contentId, file.position);

      this.deleted(res, req, 'Archivo eliminado exitosamente');
      this.logActivity(req, 'DELETE_FILE', 'ContentFile', { 
        fileId, 
        driveFileId: file.driveFileId,
        driveDeleted 
      });

    } catch (error) {
      this.handleServerError(res, req, error, 'Error al eliminar archivo');
    }
  });

  // ==================== MÉTODOS PRIVADOS AUXILIARES ====================

  /**
   * Determina el tipo de archivo basado en el MIME type
   */
  private static determineFileType(mimeType: string): any {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
      return 'document';
    }
    if (['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(mimeType)) {
      return 'presentation';
    }
    if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(mimeType)) {
      return 'spreadsheet';
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      return 'archive';
    }
    return 'other';
  }

  /**
   * Reordena archivos después de eliminar uno
   */
  private static async reorderFilesAfterDelete(contentId: bigint, deletedPosition: number): Promise<void> {
    const filesToUpdate = await ContentFiles.findAll({
      where: {
        contentId,
        position: { [Op.gt]: deletedPosition }
      }
    });

    for (const file of filesToUpdate) {
      await file.update({ position: file.position - 1 });
    }
  }


}

export default ContentFilesController;
