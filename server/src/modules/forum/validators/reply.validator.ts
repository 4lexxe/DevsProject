import { body } from "express-validator";

export const replyValidations = [ 
    body('content').notEmpty().withMessage('El contenido de la respuesta es obligatorio'),
    body('isNSFW').optional().isBoolean().withMessage('isNSFW debe ser un valor booleano'),
    body('isSpoiler').optional().isBoolean().withMessage('isSpoiler debe ser un valor booleano'),
  ];