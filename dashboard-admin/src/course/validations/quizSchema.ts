import { z } from "zod";

// Esquema para una respuesta individual
const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "La respuesta no puede estar vacía").max(255, "La respuesta no puede superar los 255 caracteres"),
  isCorrect: z.boolean(),
  explanation: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val).refine(
    (val) => !val || val.length <= 500,
    { message: "La explicación de la respuesta no puede superar los 500 caracteres" }
  ),
});

// Esquema para metadatos
const metadataSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      const tagsArray = val.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      return tagsArray.length > 0 ? tagsArray : undefined;
    })
    .refine((tags) => {
      if (!tags) return true;
      return tags.every(tag => tag.length <= 50);
    }, { message: "Cada tag debe tener máximo 50 caracteres" }),
});

// Esquema para una pregunta individual
const questionSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  question: z.string().min(5, "La pregunta debe tener al menos 5 caracteres").max(500, "La pregunta no puede superar los 500 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(1000, "La descripción no puede superar los 1000 caracteres"),
  order: z.coerce.number().min(1, "El orden debe ser mayor a 0"),
  points: z.coerce.number().min(1, "Los puntos deben ser mayor a 0"),
  markdown: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val).refine(
    (val) => !val || val.length <= 5000,
    { message: "El markdown no puede superar los 5000 caracteres" }
  ),
  explanation: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val).refine(
    (val) => !val || val.length <= 1000,
    { message: "La explicación no puede superar los 1000 caracteres" }
  ),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  type: z.enum(["MultipleChoice", "TrueOrFalse", "ShortAnswer", "Single"]),
  answers: z.array(answerSchema).min(1, "Debe haber al menos una respuesta"),
  metadata: metadataSchema.optional(),
})
// Validación para TrueOrFalse: debe tener exactamente 2 respuestas
.refine((data) => {
  if (data.type === "TrueOrFalse") {
    return data.answers.length === 2;
  }
  return true;
}, {
  message: "Las preguntas de Verdadero/Falso deben tener exactamente 2 respuestas",
  path: ["validation_truefalse_count"]
})
// Validación para TrueOrFalse: debe tener exactamente 1 respuesta correcta
.refine((data) => {
  if (data.type === "TrueOrFalse") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length === 1;
  }
  return true;
}, {
  message: "Las preguntas de Verdadero/Falso deben tener exactamente 1 respuesta correcta",
  path: ["validation_truefalse_correct"]
})
// Validación para Single: debe tener exactamente 1 respuesta correcta
.refine((data) => {
  if (data.type === "Single") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length === 1;
  }
  return true;
}, {
  message: "Las preguntas de Selección Única deben tener exactamente 1 respuesta correcta",
  path: ["validation_single_correct"]
})
// Validación para MultipleChoice: debe tener al menos 1 respuesta correcta
.refine((data) => {
  if (data.type === "MultipleChoice") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length > 0;
  }
  return true;
}, {
  message: "Las preguntas de selección múltiple deben tener al menos 1 respuesta correcta",
  path: ["validation_multiple_correct"]
})
// Validación para ShortAnswer: debe tener exactamente 1 respuesta correcta
.refine((data) => {
  if (data.type === "ShortAnswer") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length === 1;
  }
  return true;
}, {
  message: "Las preguntas de Respuesta Corta deben tener exactamente 1 respuesta correcta",
  path: ["validation_short_answer"]
});

// Esquema para el formulario completo (lista de preguntas)
export const quizSchema = z.object({
  quiz: z.array(questionSchema).min(1, "Debe haber al menos una pregunta"), // Debe haber al menos una pregunta
});