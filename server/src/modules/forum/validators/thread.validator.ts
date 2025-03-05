import { body } from "express-validator";

export const threadValidations = [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('categoryId').isInt().withMessage('El ID de la categoría debe ser un número entero'),
    body('firstPostContent').notEmpty().withMessage('El contenido del primer post es obligatorio'),
    body('isPinned').optional().isBoolean().withMessage('isPinned debe ser un valor booleano'),
    body('isLocked').optional().isBoolean().withMessage('isLocked debe ser un valor booleano'),
    body('isAnnouncement').optional().isBoolean().withMessage('isAnnouncement debe ser un valor booleano'),
  ];    