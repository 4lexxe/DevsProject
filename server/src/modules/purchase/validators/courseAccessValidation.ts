import { body, param } from 'express-validator';

/**
 * Validaciones para las rutas de acceso a cursos
 */

// Validación para el parámetro userId
export const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero positivo')
    .toInt()
];

// Validación para el parámetro courseId
export const validateCourseId = [
  param('courseId')
    .isInt({ min: 1 })
    .withMessage('El ID del curso debe ser un número entero positivo')
    .toInt()
];

// Validación para otorgar acceso a curso
export const validateGrantAccess = [
  body('userId')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero positivo')
    .toInt(),
  body('courseId')
    .isInt({ min: 1 })
    .withMessage('El ID del curso debe ser un número entero positivo')
    .toInt()
];

// Validación para revocar acceso
export const validateRevokeAccess = [
  ...validateUserId,
  ...validateCourseId,
  body('revokeReason')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('La razón de revocación debe ser una cadena de texto entre 1 y 500 caracteres')
];

// Validación para parámetros de usuario y curso
export const validateUserIdAndCourseId = [
  ...validateUserId,
  ...validateCourseId
];
