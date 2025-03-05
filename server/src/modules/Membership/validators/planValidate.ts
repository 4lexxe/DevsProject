import { body, validationResult } from "express-validator";

// Validador para crear o actualizar un Plan
export const validatePlan = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser una cadena de texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("description")
    .isString()
    .withMessage("La descripción debe ser una cadena de texto")
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),
  body("totalPrice")
    .isDecimal()
    .withMessage("El precio total debe ser un número decimal")
    .isFloat({ min: 0 })
    .withMessage("El precio total debe ser mayor o igual a 0"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("La duración debe ser un número entero mayor o igual a 1"),
  body("durationType")
    .isIn(["días", "meses"])
    .withMessage('La unidad de duración debe ser "días" o "meses"'),
  body("features")
    .isArray()
    .withMessage("Las características deben ser un arreglo")
    .notEmpty()
    .withMessage("Las características no pueden estar vacías"),
  body("isActive")
    .isBoolean()
    .withMessage("El estado activo debe ser un valor booleano"),
  body("accessLevel")
    .isIn(["Básico", "Estándar", "Premium"])
    .withMessage(
      'El nivel de acceso debe ser "Básico", "Estándar" o "Premium"'
    ),
  body("installments")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Las cuotas deben ser un número entero mayor o igual a 1")
    .custom((value, { req }) => {
      if (req.body.duration) {
        const duration = parseInt(req.body.duration, 10);
        if (duration % value !== 0) {
          throw new Error(
            "La duración debe ser divisible(que resulta un numero entero) por el número de cuotas"
          );
        }
      }
      return true;
    }),
  body("installmentPrice")
    .optional()
    .isDecimal()
    .withMessage("El precio de cada cuota debe ser un número decimal")
    .isFloat({ min: 0 })
    .withMessage("El precio de cada cuota debe ser mayor o igual a 0"),
  body("saveInMp")
    .isBoolean()
    .withMessage("El campo saveInMp debe ser un valor booleano"),
];
