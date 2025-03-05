import { body } from "express-validator";

export const postValidations = [
    body('threadId').isInt().withMessage('El ID del hilo debe ser un número entero'),
    body('content').notEmpty().withMessage('El contenido del post es obligatorio'),
    body('isNSFW').optional().isBoolean().withMessage('isNSFW debe ser un valor booleano'),
    body('isSpoiler').optional().isBoolean().withMessage('isSpoiler debe ser un valor booleano'),
  ];    