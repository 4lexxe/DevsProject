import { body } from "express-validator";

export const validateCourse = [
  body("title")
    .notEmpty().withMessage("El título es obligatorio.").bail()
    .isLength({ min: 5, max: 255 }).withMessage("El título debe tener entre 5 y 255 caracteres."),

  body("image")
    .isURL().withMessage("La imagen debe ser una URL válida.").bail()
    .isLength({ max: 255 }).withMessage("La URL de la imagen no puede superar los 500 caracteres."),

  body("summary")
    .notEmpty().withMessage("El resumen es obligatorio.").bail()
    .isLength({ min: 10, max: 1000 }).withMessage("El resumen debe tener entre 10 y 1000 caracteres."),

  body("about")
    .notEmpty().withMessage("El campo 'about' es obligatorio.").bail()
    .isLength({ min: 20, max: 5000 }).withMessage("El campo 'about' debe tener entre 20 y 5000 caracteres."),

  body("careerTypeId")
    .optional()
    .isInt().withMessage("careerTypeId debe ser un número."),
  
  body("price")
    .isFloat().withMessage("El precio debe ser un número.").bail()
    .custom((value) => {
      const price = parseFloat(value);
      if (price === 0 || price >= 100) {
        return true;
      }
      throw new Error("El precio debe ser 0 (gratis) o al menos 1000.");
    }),

  body("learningOutcomes")
    .isArray({ min: 1 }).withMessage("Debe haber al menos un resultado de aprendizaje.").bail()
    .custom((value) => {
      if (!value.every((outcome: string) => typeof outcome === "string" && outcome.length <= 255)) {
        throw new Error("Cada resultado de aprendizaje debe ser una cadena con máximo 255 caracteres.");
      }
      return true;
    }),

  body("prerequisites")
    .optional()
    .isArray().withMessage("Los prerequisitos deben ser un array.").bail()
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

  body("adminId")
    .isInt().withMessage("adminId debe ser un número."),

  body("categoryIds")
    .isArray({ min: 1 }).withMessage("Debe haber al menos una categoría.").bail()
    .custom((value) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("Todos los categoryId deben ser números.");
      }
      return true;
    }),

  // Validaciones para campos del header dinámico
  body("headerType")
    .optional()
    .isIn(['default', 'programming', 'hacking', 'custom', 'iframe'])
    .withMessage("headerType debe ser: default, programming, hacking, custom o iframe"),

  body("headerTitle")
    .optional()
    .isLength({ max: 255 }).withMessage("headerTitle no puede superar los 255 caracteres."),

  body("headerSubtitle")
    .optional()
    .isLength({ max: 255 }).withMessage("headerSubtitle no puede superar los 255 caracteres."),

  body("headerDescription")
    .optional()
    .isLength({ max: 2000 }).withMessage("headerDescription no puede superar los 2000 caracteres."),

  body("headerButtonText")
    .optional()
    .isLength({ max: 100 }).withMessage("headerButtonText no puede superar los 100 caracteres."),

  body("headerButtonLink")
    .optional()
    .isString().withMessage("headerButtonLink debe ser una cadena."),

  body("techStack")
    .optional()
    .isArray().withMessage("techStack debe ser un array.").bail()
    .custom((value) => {
      if (!value.every((tech: string) => typeof tech === "string" && tech.length <= 50)) {
        throw new Error("Cada tecnología debe ser una cadena con máximo 50 caracteres.");
      }
      return true;
    }),

  body("customHeaderContent")
    .optional()
    .isString().withMessage("customHeaderContent debe ser una cadena."),

  body("affiliatedCourseId")
    .optional()
    .isInt().withMessage("affiliatedCourseId debe ser un número."),
];
