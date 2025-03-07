import { body } from "express-validator";

// Validaciones para categorías
export const categoryValidations = [
    body('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('description')
      .notEmpty().withMessage('La descripción es obligatoria')
      .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    body('icon')
      .optional()
      .isString().withMessage('El icono debe ser una cadena de texto')
  ];