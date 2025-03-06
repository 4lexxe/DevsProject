import { body } from "express-validator";

export const validateSectionAndContents = [
  // 📌 Validar que courseId sea un número válido
  body("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),

  // 📌 Validar el título de la sección
  body("section.title")
    .trim()
    .notEmpty()
    .withMessage("El título de la sección es obligatorio")
    .isLength({ min: 3, max: 255 })
    .withMessage("El título de la sección debe tener entre 3 y 255 caracteres"),

  // 📌 Validar la descripción de la sección
  body("section.description")
    .trim()
    .notEmpty()
    .withMessage("La descripción de la sección es obligatoria")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe tener entre 10 y 1000 caracteres"),

  // 📌 Validar la imagen de portada (si existe, debe ser una URL válida)
  body("section.coverImage")
    .optional()
    .isURL()
    .withMessage("La imagen de portada debe ser una URL válida"),

  // 📌 Validar el tipo de módulo
  body("section.moduleType")
    .isIn([
      "Introductorio",
      "Principiante",
      "Intermedio",
      "Avanzado",
      "Experto",
      "Insano Hardcore",
    ])
    .withMessage("El tipo de módulo debe ser un valor válido"),

  // 📌 Validar que los contenidos sean un array
  body("section.contents")
    .isArray()
    .withMessage("Los contenidos deben ser un array"),

  // 📌 Validar cada contenido dentro del array de contenidos
  body("section.contents.*.title")
    .trim()
    .notEmpty()
    .withMessage("El título del contenido es obligatorio")
    .isLength({ min: 3, max: 255 })
    .withMessage("El título del contenido debe tener entre 3 y 255 caracteres"),

  body("section.contents.*.text")
    .trim()
    .notEmpty()
    .withMessage("El texto del contenido es obligatorio")
    .isLength({ min: 10, max: 1000 })
    .withMessage(
      "El texto del contenido debe tener entre 10 y 1000 caracteres"
    ),

  body("section.contents.*.markdown")
    .optional()
    .isString()
    .withMessage("El campo markdown debe ser una cadena de texto")
    .isLength({ max: 10000 })
    .withMessage("El campo markdown no puede superar los 10000 caracteres"),

  body("section.contents.*.linkType")
    .optional()
    .isString()
    .withMessage("El campo linkType debe ser una cadena de texto")
    .isLength({ max: 50 })
    .withMessage("El linkType no puede superar los 50 caracteres"),

  body("section.contents.*.link")
    .optional()
    .if((value) => value !== "") // Solo aplica la validación de URL si el valor no es un string vacío
    .isURL()
    .withMessage("El campo link debe ser una URL válida"),

  // 📌 Validar el quiz si existe
  body("section.contents.*.quiz")
    .optional()
    .custom((value) => {
      // Acepta null o un array
      if (value === null || Array.isArray(value)) {
        return true;
      }
      throw new Error("El campo quiz debe ser un array o null");
    })
    .withMessage("El campo quiz debe ser un array"),

  body("section.contents.*.quiz.*.question")
    .trim()
    .notEmpty()
    .withMessage("Cada pregunta del quiz debe tener un texto")
    .isLength({ min: 5, max: 255 })
    .withMessage("Cada pregunta debe tener entre 5 y 255 caracteres"),

  body("section.contents.*.quiz.*.type")
    .isIn(["Single", "MultipleChoice", "TrueOrFalse", "ShortAnswer"])
    .withMessage("El tipo de pregunta del quiz debe ser válido"),

  body("section.contents.*.quiz.*.answers")
    .isArray({ min: 1 })
    .withMessage("Cada pregunta del quiz debe tener al menos una respuesta"),

  body("section.contents.*.quiz.*.answers.*.answer")
    .trim()
    .notEmpty()
    .withMessage("Cada respuesta del quiz debe tener un texto")
    .isLength({ min: 1, max: 255 })
    .withMessage("Cada respuesta debe tener entre 1 y 255 caracteres"),

  body("section.contents.*.quiz.*.answers.*.isCorrect")
    .isBoolean()
    .withMessage("El campo isCorrect debe ser un booleano"),

  // 📌 Validar recursos si existen
  body("section.contents.*.resources")
    .optional()
    .custom((value) => {
      // Acepta null o un array
      if (value === null || Array.isArray(value)) {
        return true;
      }
      throw new Error("El campo resources debe ser un array o null");
    })
    .withMessage("El campo resources debe ser un array"),

  body("section.contents.*.resources.*.title")
    .trim()
    .notEmpty()
    .withMessage("Cada recurso debe tener un título")
    .isLength({ min: 3, max: 255 })
    .withMessage("Cada título de recurso debe tener entre 3 y 255 caracteres"),

  body("section.contents.*.resources.*.url")
    .isURL()
    .withMessage("Cada recurso debe tener una URL válida"),

  // 📌 Validar duración y posición
  body("section.contents.*.duration")
    .isInt({ gt: 0 })
    .withMessage(
      "La duración del contenido debe ser un número entero positivo"
    ),

  body("section.contents.*.position")
    .isInt({ gt: 0 })
    .withMessage(
      "La posición del contenido debe ser un número entero positivo"
    ),
];
