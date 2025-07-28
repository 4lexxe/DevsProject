import { z } from "zod";

export const courseSchema = z
  .object({
    id: z.string().optional(),
    
    title: z
      .string()
      .min(5, { message: "El título debe tener al menos 5 caracteres" })
      .nonempty({ message: "El título es obligatorio" }),

    image: z
      .string()
      .url({ message: "Debe ser una URL válida" })
      .or(z.literal("")),

    categoryIds: z
      .array(z.string(), { message: "Tipo invalido" })
      .min(1, { message: "Debe haber almenos una categoría seleccionada" }),

    summary: z
      .string()
      .min(10, { message: "El resumen debe tener al menos 10 caracteres" })
      .or(z.literal("")),

    about: z
      .string()
      .min(20, { message: "La descripción debe tener al menos 20 caracteres" })
      .or(z.literal("")),

    prerequisites: z
      .array(z.string())
      .optional()
      .or(z.literal("")),

    careerTypeId: z
      .string()
      .optional(),

    learningOutcomes: z
      .array(z.string(), { message: "Tipo invalido" })
      .min(1, { message: "Debe haber al menos un resultado de aprendizaje" })
      .or(z.literal("")),

    isActive: z.boolean(),
    isInDevelopment: z.boolean(),
    adminId: z.string()
  })
  .refine((data) => data.isActive !== data.isInDevelopment, {
    message: "El curso no puede estar activo y en desarrollo a la vez",
    path: ["isActive"],
  });

export type CourseType = z.infer<typeof courseSchema>;
