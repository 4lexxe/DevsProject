import { body } from "express-validator";

export const replyValidations = [ 
    body('content').notEmpty()
      .withMessage('El contenido de la respuesta es obligatorio')
      .isLength({ max: 10000 }).withMessage('El contenido no puede exceder 10,000 caracteres'),
    body('isNSFW').optional().isBoolean().withMessage('isNSFW debe ser un valor booleano'),
    body('isSpoiler').optional().isBoolean().withMessage('isSpoiler debe ser un valor booleano'),
  ];