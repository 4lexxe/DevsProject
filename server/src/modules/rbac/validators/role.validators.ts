import { body, param } from 'express-validator';

// Validación para crear un rol
export const createRoleValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_\s-]+$/)
    .withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 255 })
    .withMessage('La descripción debe tener entre 10 y 255 caracteres'),
  
  body('permissionIds')
    .optional()
    .isArray()
    .withMessage('permissionIds debe ser un array')
    .customSanitizer((permissionIds) => {
      // Convertir strings a enteros si es necesario
      if (Array.isArray(permissionIds)) {
        return permissionIds.map(id => 
          typeof id === 'string' ? parseInt(id, 10) : id
        );
      }
      return permissionIds;
    })
    .custom((permissionIds) => {
      // Validar que cada ID sea un entero positivo
      if (permissionIds && permissionIds.length > 0) {
        const allValid = permissionIds.every((id: any) => 
          Number.isInteger(id) && id > 0
        );
        if (!allValid) {
          throw new Error('Todos los IDs de permisos deben ser números enteros positivos');
        }
      }
      return true;
    })
];

// Validación para actualizar un rol
export const updateRoleValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_\s-]+$/)
    .withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía')
    .isLength({ min: 10, max: 255 })
    .withMessage('La descripción debe tener entre 10 y 255 caracteres'),
  
  body('permissionIds')
    .optional()
    .isArray()
    .withMessage('permissionIds debe ser un array')
    .customSanitizer((permissionIds) => {
      // Convertir strings a enteros si es necesario
      if (Array.isArray(permissionIds)) {
        return permissionIds.map(id => 
          typeof id === 'string' ? parseInt(id, 10) : id
        );
      }
      return permissionIds;
    })
    .custom((permissionIds) => {
      // Validar que cada ID sea un entero positivo
      if (permissionIds && permissionIds.length > 0) {
        const allValid = permissionIds.every((id: any) => 
          Number.isInteger(id) && id > 0
        );
        if (!allValid) {
          throw new Error('Todos los IDs de permisos deben ser números enteros positivos');
        }
      }
      return true;
    })
];

// Validación para eliminar un rol
export const deleteRoleValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID del rol debe ser un número entero positivo')
];

// Validación para obtener un rol por ID
export const getRoleByIdValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID del rol debe ser un número entero positivo')
];
