import { body, param, query } from "express-validator";

export const createCourseDiscountEventValidation = [
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
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)"),

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

  body("courseIds")
    .optional()
    .isArray()
    .withMessage("courseIds debe ser un array")
    .customSanitizer((courseIds) => {
      // Convertir strings a números si es necesario
      if (Array.isArray(courseIds)) {
        return courseIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
      return courseIds;
    })
    .custom((courseIds) => {
      if (courseIds && courseIds.length > 0 && !courseIds.every((id: any) => Number.isInteger(id) && id > 0)) {
        throw new Error("Todos los IDs de curso deben ser números enteros positivos");
      }
      return true;
    }),
];

export const updateCourseDiscountEventValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero positivo"),

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

  body("courseIds")
    .optional()
    .isArray()
    .withMessage("courseIds debe ser un array")
    .customSanitizer((courseIds) => {
      // Convertir strings a números si es necesario
      if (Array.isArray(courseIds)) {
        return courseIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
      return courseIds;
    })
    .custom((courseIds) => {
      if (courseIds && courseIds.length > 0 && !courseIds.every((id: any) => Number.isInteger(id) && id > 0)) {
        throw new Error("Todos los IDs de curso deben ser números enteros positivos");
      }
      return true;
    }),
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

// Validaciones para asociar cursos a eventos de descuento
export const addCoursesToDiscountEventValidation = [
  param("eventId")
    .isInt({ gt: 0 })
    .withMessage("El ID del evento debe ser un número entero positivo"),

  body("courseIds")
    .isArray({ min: 1 })
    .withMessage("Se requiere al menos un ID de curso")
    .customSanitizer((courseIds) => {
      // Convertir strings a números si es necesario
      if (Array.isArray(courseIds)) {
        return courseIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
      return courseIds;
    })
    .custom((courseIds) => {
      if (!courseIds.every((id: any) => Number.isInteger(id) && id > 0)) {
        throw new Error("Todos los IDs de curso deben ser números enteros positivos");
      }
      return true;
    }),
];

// Validaciones para actualizar asociaciones de cursos (permite array vacío)
export const updateCoursesForDiscountEventValidation = [
  param("eventId")
    .isInt({ gt: 0 })
    .withMessage("El ID del evento debe ser un número entero positivo"),

  body("courseIds")
    .isArray()
    .withMessage("courseIds debe ser un array")
    .customSanitizer((courseIds) => {
      // Convertir strings a números si es necesario
      if (Array.isArray(courseIds)) {
        return courseIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
      return courseIds;
    })
    .custom((courseIds) => {
      if (courseIds.length > 0 && !courseIds.every((id: any) => Number.isInteger(id) && id > 0)) {
        throw new Error("Todos los IDs de curso deben ser números enteros positivos");
      }
      return true;
    }),
];

// Validaciones para remover cursos de eventos de descuento
export const removeCoursesFromDiscountEventValidation = [
  param("eventId")
    .isInt({ gt: 0 })
    .withMessage("El ID del evento debe ser un número entero positivo"),

  body("courseIds")
    .isArray({ min: 1 })
    .withMessage("Se requiere al menos un ID de curso")
    .customSanitizer((courseIds) => {
      // Convertir strings a números si es necesario
      if (Array.isArray(courseIds)) {
        return courseIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
      return courseIds;
    })
    .custom((courseIds) => {
      if (!courseIds.every((id: any) => Number.isInteger(id) && id > 0)) {
        throw new Error("Todos los IDs de curso deben ser números enteros positivos");
      }
      return true;
    }),
];

// Validaciones para obtener descuento activo de un curso específico
export const getActiveDiscountForCourseValidation = [
  param("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),
];

// Validaciones para obtener descuentos activos de un curso
export const getActiveDiscountsForCourseValidation = [
  param("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),
];

// Validaciones para activar/desactivar eventos
export const toggleDiscountEventValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID debe ser un número entero positivo"),
];
