import { body, param, query } from 'express-validator';
import { allowedFileTypes, fileLimits, getAllowedMimeTypes, isMimeTypeAllowed } from '../config/driveConfig';

/**
 * Validaciones para operaciones de archivos en Google Drive
 */

/**
 * Validación para subida de archivos
 */
export const uploadFileValidations = [
  /* body('name')
    .notEmpty()
    .withMessage('El nombre del archivo es requerido')
    .isLength({ min: 1, max: 255 })
    .withMessage('El nombre debe tener entre 1 y 255 caracteres')
    .matches(/^[^<>:"/\\|?*]+$/)
    .withMessage('El nombre contiene caracteres no válidos'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),

  body('folderId')
    .optional()
    .isString()
    .withMessage('El ID de carpeta debe ser una cadena válida')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID de carpeta contiene caracteres no válidos'),

  body('makePublic')
    .optional()
    .isBoolean()
    .withMessage('makePublic debe ser un valor booleano'), */
];

/**
 * Validación para actualización de archivos
 */
export const updateFileValidations = [
  param('fileId')
    .notEmpty()
    .withMessage('El ID del archivo es requerido')
    .isString()
    .withMessage('El ID del archivo debe ser una cadena')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID del archivo contiene caracteres no válidos'),

  body('name')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('El nombre debe tener entre 1 y 255 caracteres')
    .matches(/^[^<>:"/\\|?*]+$/)
    .withMessage('El nombre contiene caracteres no válidos'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),

  body('folderId')
    .optional()
    .isString()
    .withMessage('El ID de carpeta debe ser una cadena válida')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID de carpeta contiene caracteres no válidos'),
];

/**
 * Validación para obtener/eliminar archivos por ID
 */
export const fileIdValidations = [
  param('fileId')
    .notEmpty()
    .withMessage('El ID del archivo es requerido')
    .isString()
    .withMessage('El ID del archivo debe ser una cadena')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID del archivo contiene caracteres no válidos'),
];

/**
 * Validación para listado de archivos
 */
export const listFilesValidations = [
  query('folderId')
    .optional()
    .isString()
    .withMessage('El ID de carpeta debe ser una cadena válida')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID de carpeta contiene caracteres no válidos'),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El tamaño de página debe ser un número entre 1 y 100')
    .toInt(),

  query('pageToken')
    .optional()
    .isString()
    .withMessage('El token de página debe ser una cadena válida'),
];

/**
 * Validación para búsqueda de archivos
 */
export const searchFilesValidations = [
  query('term')
    .notEmpty()
    .withMessage('El término de búsqueda es requerido')
    .isLength({ min: 1, max: 100 })
    .withMessage('El término debe tener entre 1 y 100 caracteres')
    .matches(/^[^<>"/\\|?*]+$/)
    .withMessage('El término contiene caracteres no válidos'),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('El tamaño de página debe ser un número entre 1 y 50')
    .toInt(),
];

/**
 * Validación para crear carpetas
 */
export const createFolderValidations = [
  body('name')
    .notEmpty()
    .withMessage('El nombre de la carpeta es requerido')
    .isLength({ min: 1, max: 255 })
    .withMessage('El nombre debe tener entre 1 y 255 caracteres')
    .matches(/^[^<>:"/\\|?*]+$/)
    .withMessage('El nombre contiene caracteres no válidos'),

  body('parentFolderId')
    .optional()
    .isString()
    .withMessage('El ID de carpeta padre debe ser una cadena válida')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID de carpeta padre contiene caracteres no válidos'),
];

/**
 * Validación para mover archivos
 */
export const moveFileValidations = [
  param('fileId')
    .notEmpty()
    .withMessage('El ID del archivo es requerido')
    .isString()
    .withMessage('El ID del archivo debe ser una cadena')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID del archivo contiene caracteres no válidos'),

  body('folderId')
    .notEmpty()
    .withMessage('El ID de la carpeta destino es requerido')
    .isString()
    .withMessage('El ID de carpeta debe ser una cadena válida')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID de carpeta contiene caracteres no válidos'),
];

/**
 * Validación para cambiar visibilidad de archivos
 */
export const changeVisibilityValidations = [
  param('fileId')
    .notEmpty()
    .withMessage('El ID del archivo es requerido')
    .isString()
    .withMessage('El ID del archivo debe ser una cadena')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El ID del archivo contiene caracteres no válidos'),

  body('isPublic')
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano'),
];

/**
 * Validador personalizado para archivos subidos
 */
export const validateUploadedFile = (file: Express.Multer.File) => {
  const errors: string[] = [];

  // Validar tamaño
  if (file.size > fileLimits.maxFileSize) {
    errors.push(`El archivo excede el tamaño máximo permitido de ${fileLimits.maxFileSize / (1024 * 1024)}MB`);
  }

  // Validar tipo MIME
  if (!isMimeTypeAllowed(file.mimetype)) {
    errors.push(`Tipo de archivo no permitido: ${file.mimetype}`);
  }

  // Validar extensión
  const fileExtension = file.originalname.toLowerCase().split('.').pop();
  if (fileExtension && !fileLimits.allowedExtensions.includes(`.${fileExtension}`)) {
    errors.push(`Extensión de archivo no permitida: .${fileExtension}`);
  }

  // Validar nombre de archivo
  if (!file.originalname || file.originalname.length > 255) {
    errors.push('El nombre del archivo debe tener entre 1 y 255 caracteres');
  }

  if (!/^[^<>:"/\\|?*]+$/.test(file.originalname)) {
    errors.push('El nombre del archivo contiene caracteres no válidos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validador para múltiples archivos
 */
export const validateMultipleFiles = (files: Express.Multer.File[]) => {
  const errors: string[] = [];

  // Validar número de archivos
  if (files.length > fileLimits.maxFilesPerUpload) {
    errors.push(`No se pueden subir más de ${fileLimits.maxFilesPerUpload} archivos a la vez`);
  }

  // Validar cada archivo individualmente
  files.forEach((file, index) => {
    const fileValidation = validateUploadedFile(file);
    if (!fileValidation.isValid) {
      errors.push(`Archivo ${index + 1} (${file.originalname}): ${fileValidation.errors.join(', ')}`);
    }
  });

  // Validar tamaño total
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSize = fileLimits.maxFileSize * fileLimits.maxFilesPerUpload;
  if (totalSize > maxTotalSize) {
    errors.push(`El tamaño total de los archivos excede el límite permitido`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Función helper para obtener tipos de archivo permitidos por categoría
 */
export const getFileTypesByCategory = (category: string): string[] => {
  switch (category.toLowerCase()) {
    case 'images':
    case 'image':
      return allowedFileTypes.images;
    case 'videos':
    case 'video':
      return allowedFileTypes.videos;
    case 'documents':
    case 'document':
      return allowedFileTypes.documents;
    case 'archives':
    case 'archive':
      return allowedFileTypes.archives;
    case 'code':
      return allowedFileTypes.code;
    default:
      return getAllowedMimeTypes();
  }
};

/**
 * Validación específica por tipo de archivo
 */
export const createFileTypeValidation = (allowedTypes: string[]) => {
  return body('mimeType')
    .custom((value) => {
      if (!allowedTypes.includes(value)) {
        throw new Error(`Tipo de archivo no permitido. Tipos válidos: ${allowedTypes.join(', ')}`);
      }
      return true;
    });
};

/**
 * Sanitizadores para limpiar datos de entrada
 */
export const sanitizeFileName = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Reemplazar caracteres no válidos
    .replace(/\s+/g, '_') // Reemplazar espacios múltiples con guión bajo
    .replace(/_+/g, '_') // Reemplazar múltiples guiones bajos con uno solo
    .substring(0, 255); // Limitar longitud
};

export const sanitizeFolderName = (folderName: string): string => {
  return folderName
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 255);
};

export const sanitizeDescription = (description: string): string => {
  return description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .replace(/<[^>]*>/g, '') // Remover HTML tags
    .substring(0, 1000); // Limitar longitud
};

export default {
  uploadFileValidations,
  updateFileValidations,
  fileIdValidations,
  listFilesValidations,
  searchFilesValidations,
  createFolderValidations,
  moveFileValidations,
  changeVisibilityValidations,
  validateUploadedFile,
  validateMultipleFiles,
  getFileTypesByCategory,
  createFileTypeValidation,
  sanitizeFileName,
  sanitizeFolderName,
  sanitizeDescription
};
