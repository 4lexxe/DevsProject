import { z } from "zod";

const quizTypeEnum = z.enum(["Multiple Choice", "true or false", "Short Answer", "Checkbox"]);

/* export const quizSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía"),
  text: z.string().optional(),
  image: z.string().url("Debe ser una URL válida").optional(),
  type: quizTypeEnum,
  answers: z.array(
    z.object({
      answer: z.string().min(1, "La respuesta no puede estar vacía"),
      isCorrect: z.boolean()
    })
  ).min(1, "Debe haber al menos una respuesta")
}); */


// Esquema para una respuesta individual
const answerSchema = z.object({
  answer: z.string().min(1, "La respuesta no puede estar vacía"), // La respuesta no puede estar vacía
  isCorrect: z.boolean(), // Debe ser un booleano
});

// Esquema para una pregunta individual
const questionSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía"), // La pregunta no puede estar vacía
  type: z.enum(["Multiple Choice", "True or False", "Short Answer", "Checkbox"]), // Solo permite estos tipos
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")), // La imagen es opcional, pero si está presente, debe ser una URL válida
  text: z.string().optional(), // El texto adicional es opcional
  answers: z.array(answerSchema).min(1, "Debe haber al menos una respuesta"), // Debe haber al menos una respuesta
});

// Esquema para el formulario completo (lista de preguntas)
export const quizSchema = z.object({
  quiz: z.array(questionSchema).min(1, "Debe haber al menos una pregunta"), // Debe haber al menos una pregunta
});







const resourceSchema = z.object({
  title: z.string().min(1, "El título no puede estar vacío"),
  url: z.string().url("Debe ser una URL válida")
});

export const contentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  text: z.string().min(1, "El texto es obligatorio"),
  markdown: z.string().optional(),
  linkType: z.string().optional(),
  link: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  resources: z.array(resourceSchema).optional(),
  duration: z.number().positive("La duración debe ser mayor a 0").default(1),
});
