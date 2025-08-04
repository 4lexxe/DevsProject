import { body, param } from 'express-validator';

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
    .isInt({ min: 1 })
    .withMessage('El ID del archivo debe ser un número entero positivo')
    .toInt()
];

// Validaciones para actualización de archivo
export const validateUpdateFile = [
  body('originalName')
    .optional()
    .isString()
    .withMessage('El nombre original debe ser una cadena de texto')
    .isLength({ min: 1, max: 255 })
    .withMessage('El nombre original debe tener entre 1 y 255 caracteres')
    .trim(),
  
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser una cadena de texto')
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres')
    .trim(),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano'),
  
  body('position')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La posición debe ser un número entero positivo')
    .toInt()
];

// Validaciones para cambio de visibilidad
export const validateToggleVisibility = [
  body('isPublic')
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano')
];

// Validaciones para subida de archivos
export const validateFileUpload = [
  body('descriptions')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      
      if (typeof value === 'string') return true;
      
      if (Array.isArray(value)) {
        return value.every(desc => typeof desc === 'string' && desc.length <= 1000);
      }
      
      return false;
    })
    .withMessage('Las descripciones deben ser strings de máximo 1000 caracteres'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic debe ser un valor booleano')
];