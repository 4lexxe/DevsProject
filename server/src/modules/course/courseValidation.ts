import { body } from "express-validator";

export const validateCourse = [
  body("title")
    .notEmpty().withMessage("El título es obligatorio.")
    .isLength({ min: 5, max: 255 }).withMessage("El título debe tener entre 5 y 255 caracteres."),

  body("image")
    .isURL().withMessage("La imagen debe ser una URL válida.")
    .isLength({ max: 255 }).withMessage("La URL de la imagen no puede superar los 500 caracteres."),

  body("summary")
    .notEmpty().withMessage("El resumen es obligatorio.")
    .isLength({ min: 10, max: 1000 }).withMessage("El resumen debe tener entre 10 y 1000 caracteres."),

  body("about")
    .notEmpty().withMessage("El campo 'about' es obligatorio.")
    .isLength({ min: 20, max: 5000 }).withMessage("El campo 'about' debe tener entre 20 y 5000 caracteres."),

  body("careerTypeId")
    .optional()
    .isInt().withMessage("careerTypeId debe ser un número."),

  body("learningOutcomes")
    .isArray({ min: 1 }).withMessage("Debe haber al menos un resultado de aprendizaje.")
    .custom((value) => {
      if (!value.every((outcome: string) => typeof outcome === "string" && outcome.length <= 255)) {
        throw new Error("Cada resultado de aprendizaje debe ser una cadena con máximo 255 caracteres.");
      }
      return true;
    }),

  body("prerequisites")
    .optional()
    .isArray().withMessage("Los prerequisitos deben ser un array.")
    .custom((value) => {
      if (!value.every((prerequisite: string) => typeof prerequisite === "string" && prerequisite.length <= 255)) {
        throw new Error("Cada prerequisito debe ser una cadena con máximo 255 caracteres.");
      }
      return true;
    }),

  body("isActive")
    .isBoolean().withMessage("isActive debe ser un booleano."),

  body("isInDevelopment")
    .isBoolean().withMessage("isInDevelopment debe ser un booleano."),

  body("isActive").custom((value, { req }) => {
    if (value === req.body.isInDevelopment) {
      throw new Error("isActive e isInDevelopment deben ser valores opuestos.");
    }
    return true;
  }),

  body("adminId")
    .isInt().withMessage("adminId debe ser un número."),

  body("categoryIds")
    .isArray({ min: 1 }).withMessage("Debe haber al menos una categoría.")
    .custom((value) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("Todos los categoryId deben ser números.");
      }
      return true;
    }),
];
