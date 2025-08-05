import { body, param } from 'express-validator';
import { allowedFileTypes, fileLimits, getAllowedMimeTypes, isMimeTypeAllowed } from '../../drive/config/driveConfig';

/**
 * Validaciones para el controlador de ContentFiles
 */

// Validación para parámetro contentId
export const validateContentId = [
  param('contentId')
    .isInt({ min: 1 })
    .withMessage('El ID del contenido debe ser un número entero positivo')
    .toInt()
];

// Validación para parámetro fileId
export const validateFileId = [
  param('fileId')
    .isUUID(4)
    .withMessage('El ID del archivo debe ser un UUID v4 válido')
];

/**
 * Validador personalizado para archivos subidos en contenido de curso
 */
export const validateUploadedFile = (file: Express.Multer.File) => {
  const errors: string[] = [];

  // Determinar si es un archivo de video para aplicar límite de tamaño diferente
  const isVideo = allowedFileTypes.videos.includes(file.mimetype);
  const maxSize = isVideo ? 400 * 1024 * 1024 * 1024 : 20 * 1024 * 1024; // 400GB para videos, 20MB para otros

  // Validar tamaño según el tipo de archivo
  if (file.size > maxSize) {
    const sizeLimit = isVideo ? '400GB' : '20MB';
    errors.push(`El archivo excede el tamaño máximo permitido de ${sizeLimit}`);
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
 * Validador para múltiples archivos en contenido de curso
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

  return {
    isValid: errors.length === 0,
    errors
  };
};