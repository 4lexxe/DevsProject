import { z } from "zod";

// Esquema para una respuesta individual
const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "La respuesta no puede estar vacía"),
  isCorrect: z.boolean(),
  explanation: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
});

// Esquema para metadatos
const metadataSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.string().optional(),
});

// Esquema para una pregunta individual
const questionSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  question: z.string().min(1, "La pregunta no puede estar vacía"),
  description: z.string().min(1, "La descripción es obligatoria"),
  order: z.number().min(1, "El orden debe ser mayor a 0"),
  points: z.number().min(1, "Los puntos deben ser mayor a 0"),
  markdown: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  explanation: z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  type: z.enum(["MultipleChoice", "TrueOrFalse", "ShortAnswer", "Single"]),
  answers: z.array(answerSchema).min(1, "Debe haber al menos una respuesta"),
  metadata: metadataSchema.optional(),
}).superRefine((data, ctx) => {
  // Validación específica para TrueOrFalse: debe tener exactamente 2 respuestas
  if (data.type === "TrueOrFalse") {
    if (data.answers.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las preguntas de Verdadero/Falso deben tener exactamente 2 respuestas",
        path: ["answers"]
      });
    } else {
      const correctAnswers = data.answers.filter(answer => answer.isCorrect);
      if (correctAnswers.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Las preguntas de Verdadero/Falso deben tener exactamente 1 respuesta correcta",
          path: ["answers"]
        });
      }
    }
  }
  
  // Validación para Single: debe tener exactamente una respuesta correcta
  if (data.type === "Single") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    if (correctAnswers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las preguntas de Selección Única deben tener exactamente 1 respuesta correcta",
        path: ["answers"]
      });
    } else if (correctAnswers.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las preguntas de Selección Única solo pueden tener 1 respuesta correcta",
        path: ["answers"]
      });
    }
  }
  
  // Validación para MultipleChoice: debe tener al menos una respuesta correcta
  if (data.type === "MultipleChoice") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    if (correctAnswers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las preguntas de Opción Múltiple deben tener al menos 1 respuesta correcta",
        path: ["answers"]
      });
    }
  }
  
  // Validación para ShortAnswer: no debe tener respuestas marcadas como correctas
  if (data.type === "ShortAnswer") {
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    if (correctAnswers.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las preguntas de Respuesta Corta no deben tener respuestas marcadas como correctas",
        path: ["answers"]
      });
    }
  }
});

// Esquema para el formulario completo (lista de preguntas)
export const quizSchema = z.object({
  quiz: z.array(questionSchema).min(1, "Debe haber al menos una pregunta"), // Debe haber al menos una pregunta
});