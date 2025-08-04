import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileLimits, isMimeTypeAllowed, createDriveClient, driveConfig } from '../config/driveConfig';
import { validateUploadedFile, validateMultipleFiles, sanitizeFileName } from '../validations/driveValidations';


async function uploadToDrive(filePath: string, fileName: string, mimeType: string, makePublic: boolean = false) {
  try {
    console.log(`📤 Iniciando subida a Drive: ${fileName} (${mimeType})`);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }
    
    // Obtener información del archivo
    const stats = fs.statSync(filePath);
    console.log(`📊 Tamaño del archivo: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    
    // Crear cliente de Drive
    const drive = createDriveClient();
    
    // Configurar opciones de subida con timeout aumentado
    const requestOptions = {
      timeout: 300000, // 5 minutos timeout
    };
    
    const response = await drive.files.create({
      requestBody: {
        name: fileName.replace(/[^\w\s.-]/g, "_"),
        ...(driveConfig.folderId && { parents: [driveConfig.folderId] })
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      },
      fields: 'id, name, size, mimeType, createdTime, webViewLink, thumbnailLink'
    }, requestOptions);
    
    console.log(`✅ Archivo subido exitosamente a Drive: ${response.data.id}`);
    
    if (!response.data.id) {
      throw new Error("No se pudo obtener el ID del archivo subido");
    }
    
    let shareableLink: string | undefined;
    
    // Hacer público si se solicita
    if (makePublic) {
      try {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
        shareableLink = response.data.webViewLink || undefined;
        console.log(`🌐 Archivo configurado como público: ${response.data.id}`);
      } catch (permError) {
        console.warn(`⚠️ No se pudo hacer público el archivo:`, permError);
      }
    }
    
    return {
      success: true,
      file: {
        id: response.data.id,
        name: response.data.name || fileName,
        mimeType: response.data.mimeType || mimeType,
        size: response.data.size || stats.size.toString(),
        webViewLink: response.data.webViewLink || "",
        webContentLink: "", // No solicitado para evitar errores
        thumbnailLink: response.data.thumbnailLink || undefined,
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        parents: undefined,
        description: undefined,
      },
      shareableLink: shareableLink || response.data.webViewLink,
    };
    
  } catch (error: any) {
    console.error('❌ Error uploading to Drive:', error);
    
    // Proporcionar mensajes de error más específicos
    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: 'Error de conexión: No se pudo conectar con Google Drive',
      };
    } else if (error.code === 'ECONNRESET') {
      return {
        success: false,
        error: 'Conexión perdida durante la subida. Intenta con un archivo más pequeño',
      };
    } else if (error.code === 403) {
      return {
        success: false,
        error: 'Permisos insuficientes para subir a Google Drive',
      };
    } else if (error.code === 413) {
      return {
        success: false,
        error: 'El archivo es demasiado grande para Google Drive',
      };
    } else if (error.message && error.message.includes('timeout')) {
      return {
        success: false,
        error: 'Timeout: El archivo es demasiado grande o la conexión es lenta',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Error desconocido al subir archivo',
    };
  }
}

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
    // Datos de la respuesta de Google Drive
    driveResponse?: {
      success: boolean;
      file?: any;
      error?: string;
      shareableLink?: string;
    };
  };
  driveFiles?: Array<{
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
    sanitizedName: string;
    // Datos de la respuesta de Google Drive
    driveResponse?: {
      success: boolean;
      file?: any;
      error?: string;
      shareableLink?: string;
    };
  }>;
  tempFilePaths?: string[]; // Para archivos temporales
}

/**
 * Configuración de Multer para manejar archivos en disco temporal
 */
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(process.cwd(), 'temp');
    // Crear directorio temporal si no existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo temporal
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitized = sanitizeFileName(file.originalname);
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

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
 * Configuración base de Multer usando archivos temporales
 */
const multerConfig = {
  storage: tempStorage,
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
 * Middleware para procesar y subir archivo único directamente a Google Drive
 */
export const processAndUploadSingleFile = async (req: FileUploadRequest, res: Response, next: NextFunction) => {
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
    // Limpiar archivo temporal
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({
      success: false,
      message: 'Archivo no válido',
      errors: validation.errors
    });
    return;
  }

  try {
    console.log(`📤 Iniciando subida a Drive: ${req.file.originalname} (${req.file.mimetype})`);
    
    // Verificar que el archivo temporal existe
    if (!req.file.path || !fs.existsSync(req.file.path)) {
      throw new Error(`Archivo temporal no encontrado: ${req.file.path}`);
    }
    
    // Obtener información del archivo
    const stats = fs.statSync(req.file.path);
    console.log(`📊 Tamaño del archivo: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    
    // Preparar opciones básicas
    const { makePublic = false } = req.body;
    const sanitizedName = sanitizeFileName(req.file.originalname);
    
    // Subir usando función simplificada
    const uploadResult = await uploadToDrive(
      req.file.path,
      sanitizedName,
      req.file.mimetype,
      Boolean(makePublic)
    );
    
    // Procesar resultado y preparar datos para el controlador
    req.driveFile = {
      buffer: Buffer.alloc(0), // No necesario con archivos temporales
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      sanitizedName: sanitizeFileName(req.file.originalname),
      driveResponse: {
        ...uploadResult,
        shareableLink: uploadResult.shareableLink || undefined
      }
    };
    
    // Agregar ruta del archivo temporal para limpieza posterior
    req.tempFilePaths = [req.file.path];
    
    console.log(`✅ Upload exitoso: ${req.file.originalname}`);
    next();

  } catch (error: any) {
    console.error(`❌ Error en upload de ${req.file.originalname}:`, error.message);
    
    // Limpiar archivo temporal en caso de error
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Preparar respuesta de error
    req.driveFile = {
      buffer: Buffer.alloc(0),
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      sanitizedName: sanitizeFileName(req.file.originalname),
      driveResponse: {
        success: false,
        error: error.message || 'Error desconocido al subir archivo'
      }
    };
    
    next();
  }
};

/**
 * Middleware para procesar múltiples archivos subidos y subirlos a Google Drive
 */
export const processAndUploadMultipleFiles = async (req: FileUploadRequest, res: Response, next: NextFunction) => {
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
    // Limpiar archivos temporales
    req.files.forEach(file => {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    res.status(400).json({
      success: false,
      message: 'Archivos no válidos',
      errors: validation.errors
    });
    return;
  }

  const { descriptions = [], makePublic = false } = req.body;
  const processedFiles: any[] = [];
  const tempPaths: string[] = [];

  // Procesar cada archivo
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    tempPaths.push(file.path);

    try {
      console.log(`📤 Procesando archivo ${i + 1}/${req.files.length}: ${file.originalname}`);
      
      // Verificar que el archivo temporal existe
      if (!file.path || !fs.existsSync(file.path)) {
        throw new Error(`Archivo temporal no encontrado: ${file.path}`);
      }
      
      // Subir archivo a Google Drive usando función simplificada
      const uploadResult = await uploadToDrive(
        file.path,
        sanitizeFileName(file.originalname),
        file.mimetype,
        Boolean(makePublic)
      );
      
      // Preparar datos para el controlador
      processedFiles.push({
        buffer: Buffer.alloc(0), // No necesario con archivos temporales
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        sanitizedName: sanitizeFileName(file.originalname),
        driveResponse: {
          ...uploadResult,
          shareableLink: uploadResult.shareableLink || undefined
        }
      });
      
      console.log(`✅ Archivo ${i + 1} procesado: ${file.originalname}`);

    } catch (error: any) {
      console.error(`❌ Error en archivo ${i + 1} (${file.originalname}):`, error.message);
      
      // Agregar archivo con error
      processedFiles.push({
        buffer: Buffer.alloc(0),
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        sanitizedName: sanitizeFileName(file.originalname),
        driveResponse: {
          success: false,
          error: error.message || 'Error desconocido al subir archivo'
        }
      });
    }
  }

  // Asignar archivos procesados y rutas temporales
  req.driveFiles = processedFiles;
  req.tempFilePaths = tempPaths;

  next();
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
 * Middleware para limpiar archivos temporales después del procesamiento
 */
export const cleanupTempFiles = (req: FileUploadRequest, res: Response, next: NextFunction) => {
  // Limpiar al final de la respuesta
  res.on('finish', () => {
    if (req.tempFilePaths && req.tempFilePaths.length > 0) {
      req.tempFilePaths.forEach(filePath => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Archivo temporal eliminado: ${filePath}`);
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo eliminar archivo temporal: ${filePath}`, error);
        }
      });
    }
  });
  
  next();
};

/**
 * Middleware para verificar límites de cuota del usuario (simplificado)
 */
export const checkUserQuota = async (req: FileUploadRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar verificación de cuota con API directa de Drive
    // Por ahora pasamos sin verificación para evitar errores
    console.log('ℹ️ Verificación de cuota temporalmente deshabilitada');
    next();
  } catch (error: any) {
    console.error('❌ Error en verificación de cuota:', error.message);
    next(); // Continuar sin bloquear por errores de cuota
  }
};

/**
 * Middleware combinado para subida de archivo único
 */
export const handleSingleFileUpload = [
  uploadSingleFile,
  checkUserQuota,
  processAndUploadSingleFile,
  cleanupTempFiles,
  logFileOperation('upload')
];

/**
 * Middleware combinado para subida de múltiples archivos
 */
export const handleMultipleFileUpload = [
  uploadMultipleFiles,
  checkUserQuota,
  processAndUploadMultipleFiles,
  cleanupTempFiles,
  logFileOperation('upload_multiple')
];

/**
 * Middleware básico para operaciones de Drive (sin archivos)
 */
export const basicDriveMiddleware = [
  // Solo logging para operaciones básicas
  logFileOperation('basic')
];

export default {
  uploadSingleFile,
  uploadMultipleFiles,
  processAndUploadSingleFile,
  processAndUploadMultipleFiles,
  cleanupTempFiles,
  logFileOperation,
  checkUserQuota,
  handleSingleFileUpload,
  handleMultipleFileUpload,
  basicDriveMiddleware
};






