import { body } from 'express-validator';

export const validateDiscount = [
  // Validación para el campo 'description'
  body('description')
    .optional() // El campo es opcional
    .isString().withMessage('La descripción debe ser una cadena de texto')
    .trim(),

  // Validación para el campo 'value'
  body('value')
    .notEmpty().withMessage('El valor del descuento es obligatorio')
    .isInt({ min: 0, max: 100 }).withMessage('El valor debe ser un entero entre 0 y 100'),

  // Validación para el campo 'startDate'
  body('startDate')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe tener un formato válido (ISO 8601)')
    .toDate(), // Convierte el valor a tipo Date

  // Validación para el campo 'endDate'
  body('endDate')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha de fin debe tener un formato válido (ISO 8601)')
    .toDate() // Convierte el valor a tipo Date
    .custom((value, { req }) => {
      if (value <= req.body.startDate) {
        throw new Error('endDate debe ser posterior a startDate');
      }
      return true;
    }),

  // Validación para el campo 'isActive'
  body('isActive')
    .optional() // El campo es opcional
    .isBoolean().withMessage('El estado activo debe ser un valor booleano'),

  // Validación para el campo 'planId'
  body('planId')
    .notEmpty().withMessage('El ID del plan es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del plan debe ser un entero mayor que 0'),

  // Validación para el campo 'event'
  body('event')
    .notEmpty().withMessage('El evento es obligatorio')
    .isString().withMessage('El evento debe ser una cadena de texto')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('El evento debe tener entre 1 y 100 caracteres'),
];