import { body } from "express-validator";

// Actualizar post.validator.ts
export const postValidations = [
  body('title').notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 255 }).withMessage('El título no puede exceder 255 caracteres'),
  body('content').notEmpty()
    .withMessage('El contenido del post es obligatorio')
    .isLength({ max: 10000 }).withMessage('El contenido no puede exceder 10,000 caracteres'),
  body('categoryId').isInt().withMessage('El ID de la categoría debe ser un número entero'),
  body('isNSFW').optional().isBoolean().withMessage('isNSFW debe ser un valor booleano'),
  body('isSpoiler').optional().isBoolean().withMessage('isSpoiler debe ser un valor booleano'),
];