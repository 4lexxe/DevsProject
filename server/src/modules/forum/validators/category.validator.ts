import { body } from "express-validator";

export const forumCategoryValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe exceder los 100 caracteres')
    .escape(),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres')
    .escape(),
  
  body('icon')
    .optional()
    .trim()
    .isURL().withMessage('El icono debe ser una URL válida')
    .escape(),
  
  body('banner')
    .optional()
    .trim()
    .isURL().withMessage('El banner debe ser una URL válida')
    .escape()
];