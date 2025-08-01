import { query } from 'express-validator';

/**
 * Validaciones para búsqueda básica de cursos
 */
export const validateBasicSearch = [
  query('q')
    .notEmpty()
    .withMessage('El término de búsqueda es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres')
    .trim()
    .escape(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100')
    .toInt()
];

/**
 * Validaciones para búsqueda avanzada de cursos
 */
export const validateAdvancedSearch = [
  query('q')
    .notEmpty()
    .withMessage('El término de búsqueda es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres')
    .trim()
    .escape(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100')
    .toInt(),

  query('category')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número entero positivo')
    .toInt(),

  query('careerType')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El tipo de carrera debe ser un número entero positivo')
    .toInt(),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número positivo')
    .toFloat(),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número positivo')
    .toFloat()
];