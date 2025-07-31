import { body } from "express-validator";

export const validateQuiz = [
  // Validar que el quiz sea un array
  body("quiz")
    .isArray({ min: 1 })
    .withMessage("El quiz debe ser un array con al menos una pregunta"),

  // Validar ID único de la pregunta
  body("quiz.*.id")
    .notEmpty()
    .withMessage("Cada pregunta del quiz debe tener un ID único")
    .isString()
    .withMessage("El ID de la pregunta debe ser una cadena de texto"),

  // Validar pregunta
  body("quiz.*.question")
    .trim()
    .notEmpty()
    .withMessage("Cada pregunta del quiz debe tener un texto")
    .isLength({ min: 5, max: 500 })
    .withMessage("Cada pregunta debe tener entre 5 y 500 caracteres"),

  // Validar descripción de la pregunta
  body("quiz.*.description")
    .notEmpty()
    .withMessage("Cada pregunta del quiz debe tener una descripción")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe tener entre 10 y 1000 caracteres"),

  // Validar orden de la pregunta
  body("quiz.*.order")
    .isInt({ min: 1 })
    .withMessage("El orden de la pregunta debe ser un número entero positivo"),

  // Validar puntos de la pregunta
  body("quiz.*.points")
    .isInt({ min: 1 })
    .withMessage("Los puntos de la pregunta deben ser un número entero positivo"),

  // Validar markdown de la pregunta (opcional)
  body("quiz.*.markdown")
    .optional()
    .isString()
    .withMessage("El markdown de la pregunta debe ser una cadena de texto")
    .isLength({ max: 5000 })
    .withMessage("El markdown de la pregunta no puede superar los 5000 caracteres"),

  // Validar explicación (opcional)
  body("quiz.*.explanation")
    .optional()
    .isString()
    .withMessage("La explicación debe ser una cadena de texto")
    .isLength({ max: 1000 })
    .withMessage("La explicación no puede superar los 1000 caracteres"),

  // Validar imagen (opcional)
  body("quiz.*.image")
    .optional()
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),

  // Validar tipo de pregunta
  body("quiz.*.type")
    .isIn(["Single", "MultipleChoice", "TrueOrFalse", "ShortAnswer"])
    .withMessage("El tipo de pregunta del quiz debe ser válido"),

  // Validar respuestas
  body("quiz.*.answers")
    .isArray({ min: 1 })
    .withMessage("Cada pregunta del quiz debe tener al menos una respuesta"),

  // Validar ID de respuesta (opcional)
  body("quiz.*.answers.*.id")
    .optional()
    .isString()
    .withMessage("El ID de la respuesta debe ser una cadena de texto"),

  // Validar texto de respuesta
  body("quiz.*.answers.*.text")
    .trim()
    .notEmpty()
    .withMessage("Cada respuesta del quiz debe tener un texto")
    .isLength({ min: 1, max: 255 })
    .withMessage("Cada respuesta debe tener entre 1 y 255 caracteres"),

  // Validar isCorrect
  body("quiz.*.answers.*.isCorrect")
    .isBoolean()
    .withMessage("El campo isCorrect debe ser un booleano"),

  // Validar explicación de respuesta (opcional)
  body("quiz.*.answers.*.explanation")
    .optional()
    .isString()
    .withMessage("La explicación de la respuesta debe ser una cadena de texto")
    .isLength({ max: 500 })
    .withMessage("La explicación de la respuesta no puede superar los 500 caracteres"),

  // Validar metadatos (opcional)
  body("quiz.*.metadata")
    .optional()
    .isObject()
    .withMessage("Los metadatos deben ser un objeto"),

  // Validar dificultad en metadatos
  body("quiz.*.metadata.difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("La dificultad debe ser: easy, medium o hard"),

  // Validar tags en metadatos
  body("quiz.*.metadata.tags")
    .optional()
    .isArray()
    .withMessage("Los tags deben ser un array")
    .custom((tags) => {
      if (Array.isArray(tags)) {
        return tags.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return true;
    })
    .withMessage("Cada tag debe ser una cadena de texto de máximo 50 caracteres"),

  // Validación personalizada para verificar que haya al menos una respuesta correcta
  body("quiz.*")
    .custom((question) => {
      if (question.answers && Array.isArray(question.answers)) {
        const hasCorrectAnswer = question.answers.some((answer: any) => answer.isCorrect === true);
        if (!hasCorrectAnswer) {
          throw new Error("Cada pregunta debe tener al menos una respuesta correcta");
        }
      }
      return true;
    }),

  // Validación personalizada según el tipo de pregunta
  body("quiz.*")
    .custom((question) => {
      if (question.type && question.answers && Array.isArray(question.answers)) {
        const correctAnswers = question.answers.filter((answer: any) => answer.isCorrect === true);
        
        switch (question.type) {
          case "TrueOrFalse":
            if (question.answers.length !== 2) {
              throw new Error("Las preguntas de Verdadero/Falso deben tener exactamente 2 respuestas");
            }
            if (correctAnswers.length !== 1) {
              throw new Error("Las preguntas de Verdadero/Falso deben tener exactamente 1 respuesta correcta");
            }
            break;
          case "Single":
            if (correctAnswers.length !== 1) {
              throw new Error("Las preguntas de selección única deben tener exactamente 1 respuesta correcta");
            }
            break;
          case "MultipleChoice":
            if (correctAnswers.length < 1) {
              throw new Error("Las preguntas de selección múltiple deben tener al menos 1 respuesta correcta");
            }
            break;
          case "ShortAnswer":
            if (correctAnswers.length !== 1) {
              throw new Error("Las preguntas de respuesta corta deben tener exactamente 1 respuesta correcta");
            }
            break;
        }
      }
      return true;
    })
];
