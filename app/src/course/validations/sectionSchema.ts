import { z } from "zod";
import { contentSchema } from "./contentSchema";

export const moduleTypes = [
    "Introductorio",
    "Básico",
    "Intermedio",
    "Avanzado",
    "Experto",
] as const;

export type moduleTypes = (typeof moduleTypes)[number];

export const sectionSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "Debe haber almenos 10 caracteres"),
  moduleType: z.enum(moduleTypes, {
    message: "Categoría invalida"
  }).refine((val): boolean => val !== undefined && val !== null, {
    message: "El tipo de módulo es obligatorio"
  }),
  coverImage: z.string().url("Debe ser una URL válida").optional(),
});


export type SectionType = z.infer<typeof sectionSchema>;