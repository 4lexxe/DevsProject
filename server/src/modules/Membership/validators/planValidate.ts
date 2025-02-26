import { body, validationResult } from 'express-validator';

// Validador para crear o actualizar un Plan
export const validatePlan = [
  // Validación para el campo 'name'
  body('name')
    .notEmpty().withMessage('El nombre del plan es obligatorio')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  // Validación para el campo 'description'
  body('description')
    .notEmpty().withMessage('La descripción del plan es obligatoria')
    .isString().withMessage('La descripción debe ser una cadena de texto')
    .isLength({ min: 10, max: 255 }).withMessage('La descripción debe tener entre 10 y 255 caracteres'),

  // Validación para el campo 'price'
  body('price')
    .notEmpty().withMessage('El precio del plan es obligatorio')
    .isDecimal().withMessage('El precio debe ser un número decimal')
    .custom((value) => {
      if (value < 0) {
        throw new Error('El precio no puede ser negativo');
      }
      return true;
    }),

  // Validación para el campo 'duration'
  body('duration')
    .notEmpty().withMessage('La duración del plan es obligatoria')
    .isString().withMessage('La duración debe ser una cadena de texto')
    .matches(/^(\d+\s+((segundo|minuto|hora|día|semana|mes|año)s?|(segundos|minutos|horas|días|semanas|meses|años)))+$/i)
    .withMessage('La duración debe tener un formato válido (ej: "1 mes", "2 semanas")'),

  // Validación para el campo 'features'
  body('features')
    .notEmpty().withMessage('Las características del plan son obligatorias')
    .isArray({ min: 1 }).withMessage('Debe proporcionar al menos una característica')
    .custom((value) => {
      if (!value.every((item: any) => typeof item === 'string')) {
        throw new Error('Todas las características deben ser cadenas de texto');
      }
      return true;
    }),

  // Validación para el campo 'isActive'
  body('isActive')
    .optional()
    .isBoolean().withMessage('El estado activo debe ser un valor booleano'),

  // Validación para el campo 'supportLevel'
  body('supportLevel')
    .notEmpty().withMessage('El nivel de soporte es obligatorio')
    .isIn(['Básico', 'Estándar', 'Premium']).withMessage('El nivel de soporte debe ser "Básico", "Estándar" o "Premium"'),

  // Validación para el campo 'installments'
  body('installments')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de cuotas debe ser un entero mayor o igual a 1'),

  // Validación para el campo 'installmentPrice'
  body('installmentPrice')
    .optional()
    .isDecimal().withMessage('El precio por cuota debe ser un número decimal')
    .custom((value) => {
      if (value < 0) {
        throw new Error('El precio por cuota no puede ser negativo');
      }
      return true;
    }),
];