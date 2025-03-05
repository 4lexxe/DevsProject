import { body } from 'express-validator';
import { ReportTargetType } from '../models/Report';

// Validaciones comunes
export const reportValidations = {
  submitReport: [
    body('targetId')
      .isInt({ min: 1 }).withMessage('El ID del objetivo debe ser un número entero válido'),
    body('targetType')
      .isIn(Object.values(ReportTargetType)).withMessage('Tipo de objetivo no válido'),
    body('reason')
      .trim()
      .isLength({ min: 3, max: 500 }).withMessage('La razón debe tener entre 3 y 500 caracteres')
      .escape()
  ], 
}