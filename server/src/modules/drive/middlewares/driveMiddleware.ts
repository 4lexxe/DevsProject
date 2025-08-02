import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { validateDriveConfig, fileLimits, isMimeTypeAllowed } from '../config/driveConfig';
import { validateUploadedFile, validateMultipleFiles, sanitizeFileName } from '../validations/driveValidations';
import DriveService from '../services/driveService';

/**
 * Interfaces para extender Request con información de archivos
 */
export interface FileUploadRequest extends Request {
  driveFile?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
    sanitizedName: string;
  };
  driveFiles?: Array<{
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
    sanitizedName: string;
  }>;
  driveService?: DriveService;
}

/**
 * Configuración de Multer para manejar archivos en memoria
 */
const storage = multer.memoryStorage();

/**
 * Filtro de archivos para validar tipos permitidos
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Validar tipo MIME
  if (!isMimeTypeAllowed(file.mimetype)) {
    return cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }

  // Validar extensión
  const fileExtension = file.originalname.toLowerCase().split('.').pop();
  if (fileExtension && !fileLimits.allowedExtensions.includes(`.${fileExtension}`)) {
    return cb(new Error(`Extensión no permitida: .${fileExtension}`));
  }

  cb(null, true);
};

/**
 * Configuración base de Multer
 */
const multerConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: fileLimits.maxFileSize,
    files: fileLimits.maxFilesPerUpload,
  },
};

/**
 * Middleware para subir un solo archivo
 */
export const uploadSingleFile = multer(multerConfig).single('file');

/**
 * Middleware para subir múltiples archivos
 */
export const uploadMultipleFiles = multer(multerConfig).array('files', fileLimits.maxFilesPerUpload);

/**
 * Middleware para validar la configuración de Google Drive
 */
export const validateDriveConfiguration = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateDriveConfig();
  
  if (!validation.isValid) {
    res.status(500).json({
      success: false,
      message: 'Google Drive no está configurado correctamente',
      errors: {
        missingVariables: validation.missingVars,
        required: [
          'GOOGLE_DRIVE_CLIENT_ID',
          'GOOGLE_DRIVE_CLIENT_SECRET',
          'GOOGLE_DRIVE_REFRESH_TOKEN'
        ]
      }
    });
    return;
  }

  next();
};

/**
 * Middleware para inicializar el servicio de Drive
 */
export const initializeDriveService = (req: FileUploadRequest, res: Response, next: NextFunction) => {
  try {
    req.driveService = new DriveService();
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al inicializar servicio de Google Drive',
      error: error.message
    });
  }
};

/**
 * Middleware para procesar archivo único subido
 */
export const processSingleFile = (req: FileUploadRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No se proporcionó ningún archivo'
    });
    return;
  }

  // Validar archivo
  const validation = validateUploadedFile(req.file);
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: 'Archivo no válido',
      errors: validation.errors
    });
    return;
  }

  // Procesar y sanitizar archivo
  req.driveFile = {
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    sanitizedName: sanitizeFileName(req.file.originalname),
  };

  next();
};

/**
 * Middleware para procesar múltiples archivos subidos
 */
export const processMultipleFiles = (req: FileUploadRequest, res: Response, next: NextFunction) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({
      success: false,
      message: 'No se proporcionaron archivos'
    });
    return;
  }

  // Validar archivos
  const validation = validateMultipleFiles(req.files);
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: 'Archivos no válidos',
      errors: validation.errors
    });
    return;
  }

  // Procesar y sanitizar archivos
  req.driveFiles = req.files.map(file => ({
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    sanitizedName: sanitizeFileName(file.originalname),
  }));

  next();
};

/**
 * Middleware para manejo de errores de Multer
 */
export const handleMulterErrors = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    let message = 'Error al procesar archivo';
    let statusCode = 400;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `Archivo demasiado grande. Máximo permitido: ${fileLimits.maxFileSize / (1024 * 1024)}MB`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = `Demasiados archivos. Máximo permitido: ${fileLimits.maxFilesPerUpload}`;
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Demasiados campos en el formulario';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Nombre de campo demasiado largo';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Valor de campo demasiado largo';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Campo de archivo inesperado';
        break;
      default:
        message = error.message || 'Error desconocido al procesar archivo';
    }

    res.status(statusCode).json({
      success: false,
      message,
      code: error.code
    });
    return;
  }

  // Error de filtro de archivo
  if (error.message && error.message.includes('Tipo de archivo no permitido')) {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }

  if (error.message && error.message.includes('Extensión no permitida')) {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }

  // Error genérico
  next(error);
};

/**
 * Middleware para logging de operaciones de archivos
 */
export const logFileOperation = (operation: string) => {
  return (req: FileUploadRequest, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const timestamp = new Date().toISOString();
    
    let fileInfo = '';
    if (req.driveFile) {
      fileInfo = `archivo: ${req.driveFile.originalname} (${req.driveFile.mimetype}, ${req.driveFile.size} bytes)`;
    } else if (req.driveFiles) {
      fileInfo = `archivos: ${req.driveFiles.length} archivos`;
    }

    console.log(`[DRIVE_${operation.toUpperCase()}] ${timestamp} - Usuario: ${user?.id || 'anónimo'} - ${fileInfo} - IP: ${req.ip}`);
    
    next();
  };
};

/**
 * Middleware para verificar límites de cuota del usuario
 */
export const checkUserQuota = async (req: FileUploadRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.driveService) {
      res.status(500).json({
        success: false,
        message: 'Servicio de Drive no inicializado'
      });
      return;
    }

    // Obtener información de almacenamiento
    const storageInfo = await req.driveService.getStorageInfo();
    
    if (storageInfo) {
      const usedBytes = parseInt(storageInfo.usage);
      const limitBytes = parseInt(storageInfo.limit);
      const availableBytes = limitBytes - usedBytes;
      
      // Calcular tamaño de archivos a subir
      let uploadSize = 0;
      if (req.driveFile) {
        uploadSize = req.driveFile.size;
      } else if (req.driveFiles) {
        uploadSize = req.driveFiles.reduce((sum, file) => sum + file.size, 0);
      }

      // Verificar si hay espacio suficiente
      if (uploadSize > availableBytes) {
        res.status(413).json({
          success: false,
          message: 'No hay suficiente espacio en Google Drive',
          quotaInfo: {
            used: `${(usedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            limit: `${(limitBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            available: `${(availableBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            required: `${(uploadSize / (1024 * 1024)).toFixed(2)} MB`
          }
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.warn('No se pudo verificar la cuota de Drive, continuando:', error);
    next();
  }
};

/**
 * Middleware para cache de archivos (opcional)
 */
export const setCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Cache de archivos estáticos por 1 hora
  res.set({
    'Cache-Control': 'public, max-age=3600',
    'ETag': `"${Date.now()}"`,
  });
  
  next();
};

/**
 * Middleware combinado para subida de archivo único
 */
export const handleSingleFileUpload = [
  validateDriveConfiguration,
  initializeDriveService,
  uploadSingleFile,
  handleMulterErrors,
  processSingleFile,
  checkUserQuota,
  logFileOperation('upload')
];

/**
 * Middleware combinado para subida de múltiples archivos
 */
export const handleMultipleFileUpload = [
  validateDriveConfiguration,
  initializeDriveService,
  uploadMultipleFiles,
  handleMulterErrors,
  processMultipleFiles,
  checkUserQuota,
  logFileOperation('upload_multiple')
];

/**
 * Middleware básico para operaciones de Drive
 */
export const basicDriveMiddleware = [
  validateDriveConfiguration,
  initializeDriveService
];

export default {
  uploadSingleFile,
  uploadMultipleFiles,
  validateDriveConfiguration,
  initializeDriveService,
  processSingleFile,
  processMultipleFiles,
  handleMulterErrors,
  logFileOperation,
  checkUserQuota,
  setCacheHeaders,
  handleSingleFileUpload,
  handleMultipleFileUpload,
  basicDriveMiddleware
};
