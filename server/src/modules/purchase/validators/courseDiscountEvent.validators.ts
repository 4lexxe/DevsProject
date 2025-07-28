import { body, param, query } from "express-validator";

export const createCourseDiscountEventValidation = [
  body("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),

  body("event")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre del evento debe tener entre 1 y 100 caracteres"),

  body("description")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("La descripción es requerida"),

  body("value")
    .isInt({ min: 1, max: 100 })
    .withMessage("El valor del descuento debe ser un número entre 1 y 100"),

  body("startDate")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .custom((value, { req }) => {
      const startDate = new Date(value);
      const now = new Date();
      if (startDate < now) {
        throw new Error("La fecha de inicio no puede ser anterior a la fecha actual");
      }
      return true;
    }),

  body("endDate")
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("El campo isActive debe ser un valor booleano"),
];

export const updateCourseDiscountEventValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero positivo"),

  body("courseId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),

  body("event")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre del evento debe tener entre 1 y 100 caracteres"),

  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("La descripción es requerida"),

  body("value")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El valor del descuento debe ser un número entre 1 y 100"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (endDate <= startDate) {
          throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("El campo isActive debe ser un valor booleano"),
];

export const getCourseDiscountEventByIdValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero positivo"),
];

export const deleteCourseDiscountEventValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero positivo"),
];

export const getCourseDiscountEventsValidation = [
  query("courseId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("El campo isActive debe ser un valor booleano"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero positivo"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100"),
];
