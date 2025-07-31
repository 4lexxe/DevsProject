import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import DriveService, { DriveFile, UploadFileOptions } from '../services/driveService';
import { FileUploadRequest } from '../middlewares/driveMiddleware';
import { sanitizeFileName, sanitizeFolderName, sanitizeDescription } from '../validations/driveValidations';
import { getAllowedMimeTypes, allowedFileTypes, fileLimits } from '../config/driveConfig';

/**
 * Controlador para operaciones con Google Drive API
 * Extiende BaseController para respuestas consistentes
 */
export class DriveController extends BaseController {

  /**
   * Sube un archivo único a Google Drive
   * POST /api/drive/upload
   */
  static uploadFile = this.asyncHandler(async (req: FileUploadRequest, res: Response) => {
    // Validar errores de express-validator
    if (!this.handleValidationErrors(req, res)) return;

    // Verificar que el archivo esté procesado
    if (!req.driveFile) {
      return this.sendError(res, req, 'No se encontró el archivo procesado', 400);
    }

    // Verificar que el servicio esté inicializado
    if (!req.driveService) {
      return this.sendError(res, req, 'Servicio de Drive no disponible', 500);
    }

    try {
      const { name, description, folderId, makePublic } = req.body;
      
      const uploadOptions: UploadFileOptions = {
        name: name || req.driveFile.sanitizedName,
        description: description ? sanitizeDescription(description) : undefined,
        folderId: folderId,
        makePublic: makePublic === true || makePublic === 'true'
      };

      const result = await req.driveService.uploadFile(
        req.driveFile.buffer,
        req.driveFile.mimetype,
        uploadOptions
      );

      if (!result.success) {
        return this.sendError(res, req, result.error || 'Error al subir archivo', 500);
      }

      this.logActivity(req, 'UPLOAD_FILE', 'DriveFile', {
        fileId: result.file?.id,
        fileName: result.file?.name,
        size: req.driveFile.size,
        mimeType: req.driveFile.mimetype
      });

      this.created(res, req, {
        file: result.file,
        shareableLink: result.shareableLink,
        uploadInfo: {
          originalName: req.driveFile.originalname,
          size: req.driveFile.size,
          mimeType: req.driveFile.mimetype
        }
      }, 'Archivo subido exitosamente a Google Drive');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error interno al subir archivo');
    }
  });

  /**
   * Sube múltiples archivos a Google Drive
   * POST /api/drive/upload/multiple
   */
  static uploadMultipleFiles = this.asyncHandler(async (req: FileUploadRequest, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    if (!req.driveFiles || req.driveFiles.length === 0) {
      return this.sendError(res, req, 'No se encontraron archivos procesados', 400);
    }

    if (!req.driveService) {
      return this.sendError(res, req, 'Servicio de Drive no disponible', 500);
    }

    try {
      const { description, folderId, makePublic } = req.body;
      const uploadResults = [];
      const uploadErrors = [];

      for (let i = 0; i < req.driveFiles.length; i++) {
        const file = req.driveFiles[i];
        
        const uploadOptions: UploadFileOptions = {
          name: file.sanitizedName,
          description: description ? sanitizeDescription(description) : undefined,
          folderId: folderId,
          makePublic: makePublic === true || makePublic === 'true'
        };

        try {
          const result = await req.driveService.uploadFile(
            file.buffer,
            file.mimetype,
            uploadOptions
          );

          if (result.success) {
            uploadResults.push({
              file: result.file,
              shareableLink: result.shareableLink,
              originalName: file.originalname
            });
          } else {
            uploadErrors.push({
              fileName: file.originalname,
              error: result.error
            });
          }
        } catch (error: any) {
          uploadErrors.push({
            fileName: file.originalname,
            error: error.message
          });
        }
      }

      this.logActivity(req, 'UPLOAD_MULTIPLE_FILES', 'DriveFile', {
        totalFiles: req.driveFiles.length,
        successfulUploads: uploadResults.length,
        failedUploads: uploadErrors.length
      });

      const message = uploadErrors.length === 0 
        ? 'Todos los archivos se subieron exitosamente'
        : `${uploadResults.length} archivos subidos, ${uploadErrors.length} errores`;

      this.sendSuccess(res, req, {
        successful: uploadResults,
        errors: uploadErrors,
        summary: {
          total: req.driveFiles.length,
          successful: uploadResults.length,
          failed: uploadErrors.length
        }
      }, message, 201);

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error interno al subir archivos múltiples');
    }
  });

  /**
   * Obtiene información de un archivo por ID
   * GET /api/drive/files/:fileId
   */
  static getFile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const driveService = new DriveService();

    try {
      const file = await driveService.getFile(fileId);

      if (!file) {
        return this.notFound(res, req, 'Archivo');
      }

      this.sendSuccess(res, req, file, 'Archivo obtenido exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al obtener archivo');
    }
  });

  /**
   * Actualiza metadatos de un archivo
   * PUT /api/drive/files/:fileId
   */
  static updateFile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const { name, description, folderId } = req.body;
    const driveService = new DriveService();

    try {
      const updateOptions = {
        name: name ? sanitizeFileName(name) : undefined,
        description: description ? sanitizeDescription(description) : undefined,
        folderId: folderId
      };

      const updatedFile = await driveService.updateFile(fileId, updateOptions);

      if (!updatedFile) {
        return this.notFound(res, req, 'Archivo');
      }

      this.logActivity(req, 'UPDATE_FILE', 'DriveFile', {
        fileId,
        updates: updateOptions
      });

      this.updated(res, req, updatedFile, 'Archivo actualizado exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al actualizar archivo');
    }
  });

  /**
   * Elimina un archivo de Google Drive
   * DELETE /api/drive/files/:fileId
   */
  static deleteFile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const driveService = new DriveService();

    try {
      // Verificar que el archivo existe antes de eliminarlo
      const existingFile = await driveService.getFile(fileId);
      if (!existingFile) {
        return this.notFound(res, req, 'Archivo');
      }

      const deleted = await driveService.deleteFile(fileId);

      if (!deleted) {
        return this.sendError(res, req, 'No se pudo eliminar el archivo', 500);
      }

      this.logActivity(req, 'DELETE_FILE', 'DriveFile', {
        fileId,
        fileName: existingFile.name
      });

      this.deleted(res, req, 'Archivo eliminado exitosamente de Google Drive');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al eliminar archivo');
    }
  });

  /**
   * Lista archivos en una carpeta
   * GET /api/drive/files
   */
  static listFiles = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const { folderId, pageSize = 10, pageToken } = req.query;
    const driveService = new DriveService();

    try {
      const result = await driveService.listFiles(
        folderId as string,
        parseInt(pageSize as string),
        pageToken as string
      );

      this.sendSuccess(res, req, {
        files: result.files,
        pagination: {
          hasNextPage: !!result.nextPageToken,
          nextPageToken: result.nextPageToken,
          currentPageSize: result.files.length,
          requestedPageSize: parseInt(pageSize as string)
        }
      }, 'Archivos listados exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al listar archivos');
    }
  });

  /**
   * Busca archivos por nombre
   * GET /api/drive/search
   */
  static searchFiles = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const { term, pageSize = 10 } = req.query;
    const driveService = new DriveService();

    try {
      const files = await driveService.searchFiles(
        term as string,
        parseInt(pageSize as string)
      );

      this.sendSuccess(res, req, {
        files,
        searchTerm: term,
        resultCount: files.length
      }, `Se encontraron ${files.length} archivos`);

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al buscar archivos');
    }
  });

  /**
   * Crea una carpeta en Google Drive
   * POST /api/drive/folders
   */
  static createFolder = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const { name, parentFolderId } = req.body;
    const driveService = new DriveService();

    try {
      const sanitizedName = sanitizeFolderName(name);
      const folderId = await driveService.createFolder(sanitizedName, parentFolderId);

      if (!folderId) {
        return this.sendError(res, req, 'No se pudo crear la carpeta', 500);
      }

      // Obtener información completa de la carpeta creada
      const folderInfo = await driveService.getFile(folderId);

      this.logActivity(req, 'CREATE_FOLDER', 'DriveFolder', {
        folderId,
        folderName: sanitizedName,
        parentFolderId
      });

      this.created(res, req, {
        folder: folderInfo,
        folderId,
        originalName: name,
        sanitizedName
      }, 'Carpeta creada exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al crear carpeta');
    }
  });

  /**
   * Mueve un archivo a otra carpeta
   * POST /api/drive/files/:fileId/move
   */
  static moveFile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const { folderId } = req.body;
    const driveService = new DriveService();

    try {
      // Verificar que el archivo existe
      const existingFile = await driveService.getFile(fileId);
      if (!existingFile) {
        return this.notFound(res, req, 'Archivo');
      }

      const moved = await driveService.moveFile(fileId, folderId);

      if (!moved) {
        return this.sendError(res, req, 'No se pudo mover el archivo', 500);
      }

      this.logActivity(req, 'MOVE_FILE', 'DriveFile', {
        fileId,
        fileName: existingFile.name,
        newFolderId: folderId
      });

      this.sendSuccess(res, req, {
        fileId,
        fileName: existingFile.name,
        newFolderId: folderId
      }, 'Archivo movido exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al mover archivo');
    }
  });

  /**
   * Cambia la visibilidad de un archivo (público/privado)
   * POST /api/drive/files/:fileId/visibility
   */
  static changeFileVisibility = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const { isPublic } = req.body;
    const driveService = new DriveService();

    try {
      // Verificar que el archivo existe
      const existingFile = await driveService.getFile(fileId);
      if (!existingFile) {
        return this.notFound(res, req, 'Archivo');
      }

      let shareableLink: string | null = null;
      let success = false;

      if (isPublic) {
        shareableLink = await driveService.makeFilePublic(fileId);
        success = shareableLink !== null;
      } else {
        success = await driveService.makeFilePrivate(fileId);
      }

      if (!success) {
        return this.sendError(res, req, 'No se pudo cambiar la visibilidad del archivo', 500);
      }

      this.logActivity(req, 'CHANGE_VISIBILITY', 'DriveFile', {
        fileId,
        fileName: existingFile.name,
        isPublic,
        shareableLink
      });

      this.sendSuccess(res, req, {
        fileId,
        fileName: existingFile.name,
        isPublic,
        shareableLink: shareableLink || undefined
      }, `Archivo ${isPublic ? 'hecho público' : 'hecho privado'} exitosamente`);

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al cambiar visibilidad del archivo');
    }
  });

  /**
   * Obtiene información de almacenamiento de Google Drive
   * GET /api/drive/storage
   */
  static getStorageInfo = this.asyncHandler(async (req: Request, res: Response) => {
    const driveService = new DriveService();

    try {
      const storageInfo = await driveService.getStorageInfo();

      if (!storageInfo) {
        return this.sendError(res, req, 'No se pudo obtener información de almacenamiento', 500);
      }

      const usedBytes = parseInt(storageInfo.usage);
      const limitBytes = parseInt(storageInfo.limit);
      const availableBytes = limitBytes - usedBytes;
      const usedPercentage = (usedBytes / limitBytes) * 100;

      this.sendSuccess(res, req, {
        raw: storageInfo,
        formatted: {
          used: `${(usedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          limit: `${(limitBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          available: `${(availableBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          usedPercentage: `${usedPercentage.toFixed(1)}%`
        },
        bytes: {
          used: usedBytes,
          limit: limitBytes,
          available: availableBytes
        }
      }, 'Información de almacenamiento obtenida exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al obtener información de almacenamiento');
    }
  });

  /**
   * Obtiene tipos de archivo permitidos
   * GET /api/drive/allowed-types
   */
  static getAllowedFileTypes = this.asyncHandler(async (req: Request, res: Response) => {
    this.sendSuccess(res, req, {
      mimeTypes: getAllowedMimeTypes(),
      categories: allowedFileTypes,
      limits: fileLimits,
      extensions: fileLimits.allowedExtensions
    }, 'Tipos de archivo permitidos obtenidos exitosamente');
  });

  /**
   * Obtiene información básica de un archivo público
   * GET /api/drive/public/files/:fileId
   */
  static getPublicFile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const driveService = new DriveService();

    try {
      const file = await driveService.getFile(fileId);

      if (!file) {
        return this.notFound(res, req, 'Archivo');
      }

      // Solo devolver información básica para archivos públicos
      const publicFileInfo = {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        webViewLink: file.webViewLink,
        thumbnailLink: file.thumbnailLink,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime
      };

      this.sendSuccess(res, req, publicFileInfo, 'Información pública del archivo obtenida exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al obtener archivo público');
    }
  });

  /**
   * Obtiene enlace de descarga para archivos públicos
   * GET /api/drive/public/files/:fileId/download
   */
  static getPublicDownloadLink = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const fileId = req.params.fileId;
    const driveService = new DriveService();

    try {
      const file = await driveService.getFile(fileId);

      if (!file) {
        return this.notFound(res, req, 'Archivo');
      }

      // Verificar si el archivo tiene un enlace público
      if (!file.webContentLink && !file.webViewLink) {
        return this.sendError(res, req, 'El archivo no está disponible públicamente', 403);
      }

      this.sendSuccess(res, req, {
        downloadLink: file.webContentLink || file.webViewLink,
        fileName: file.name,
        mimeType: file.mimeType,
        size: file.size
      }, 'Enlace de descarga obtenido exitosamente');

    } catch (error: any) {
      this.handleServerError(res, req, error, 'Error al obtener enlace de descarga');
    }
  });
}

export default DriveController;
