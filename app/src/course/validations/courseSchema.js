import { z } from "zod";
export const courseSchema = z
    .object({
    title: z
        .string()
        .min(5, { message: "El título debe tener al menos 5 caracteres" })
        .nonempty({ message: "El título es obligatorio" }),
    image: z
        .string()
        .url({ message: "Debe ser una URL válida" })
        .nonempty({ message: "Este campo no puede estar vacío" })
        .optional(),
    categoryIds: z
        .array(z.string(), { message: "Tipo invalido" })
        .min(1, { message: "Debe haber almenos una categoría seleccionada" })
        .optional(),
    summary: z
        .string()
        .min(10, { message: "El resumen debe tener al menos 10 caracteres" })
        .optional(),
    about: z
        .string()
        .min(20, { message: "La descripción debe tener al menos 20 caracteres" })
        .optional(),
    prerequisites: z.array(z.string()).optional().or(z.literal(null)),
    careerTypeId: z.string().optional().or(z.literal(null)),
    learningOutcomes: z
        .array(z.string(), { message: "Tipo invalido" })
        .min(1, { message: "Debe haber al menos un resultado de aprendizaje" }),
    isActive: z.boolean(),
    isInDevelopment: z.boolean(),
    adminId: z.string()
})
    .refine((data) => data.isActive !== data.isInDevelopment, {
    message: "El curso no puede estar activo y en desarrollo a la vez",
    path: ["isActive"],
});
