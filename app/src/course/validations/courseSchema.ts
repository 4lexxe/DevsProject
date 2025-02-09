import { z } from "zod";
import { sectionSchema } from "./sectionSchema";
import { contentSchema } from "./contentSchema";

export const categories = [
    "Programación",
    "Diseño",
    "Marketing",
    "Negocios",
    "Data Analytics",
    "Data Science",
    "Life Skills",
    "Audio & Visual",
    "Technology",
    "Personal Development",
    "Finanzas",
    "Trading",
] as const; // Usamos `as const` para convertirlo en una tupla de valores constantes

export type Categories = (typeof categories)[number];

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "El título debe tener al menos 3 caracteres" })
        .nonempty({ message: "El título es obligatorio" }),

    image: z
        .string()
        .url({ message: "Debe ser una URL válida" })
        .nonempty({ message: "Este campo no puede estar vacío" })
        .optional(),

    category: z
        .enum(categories, { message: "Categoría inválida" }) // Validamos contra los valores del array
        .refine((val) => val !== undefined && val !== null, {
            message: "La categoría es obligatoria",
        })
        .optional(),

    summary: z
        .string()
        .min(10, { message: "El resumen debe tener al menos 10 caracteres" })
        .optional(),

    about: z
        .string()
        .min(20, { message: "La descripción debe tener al menos 20 caracteres" })
        .optional(),

    relatedCareerType: z
        .string()
        .nonempty({ message: "Este campo no puede estar vacío" })
        .optional(),

    learningOutcomes: z
        .array(z.string(), { message: "Tipo invalido" })
        .min(1, { message: "Debe haber al menos un resultado de aprendizaje" }),

    isActive: z.boolean().default(false),
    isInDevelopment: z.boolean().default(true),

    // Validamos que el curso tenga al menos una sección
    Sections: z
        .array(
            sectionSchema.extend({ 
                contents: z
                    .array(contentSchema)
                    .min(1, { message: "La sección debe tener al menos un contenido" }),
            })
        )
        .min(1, { message: "El curso debe tener al menos una sección" }),
});

export type CourseType = z.infer<typeof courseSchema>;
