import { z } from "zod";
export const moduleTypes = [
    "Introductorio",
    "Principiante",
    "Intermedio",
    "Avanzado",
    "Experto",
    "Insano Hardcore"
];
export const sectionSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "Debe haber al menos 10 caracteres"),
    moduleType: z.enum(moduleTypes, {
        message: "Categoría inválida"
    }),
    coverImage: z.string().url("Debe ser una URL válida").optional(),
}).and(z.object({
    colorGradient: z
        .array(z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color inválido"))
        .length(2, "Debe seleccionar exactamente 2 colores")
}));
