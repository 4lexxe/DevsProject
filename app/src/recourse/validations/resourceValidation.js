import { z } from "zod";
// Resource validation schema
export const resourceSchema = z.object({
    title: z
        .string()
        .min(1, "El título es obligatorio")
        .max(55, "El título no puede tener más de 55 caracteres")
        .trim(),
    description: z
        .string()
        .max(500, "La descripción no puede tener más de 500 caracteres")
        .optional()
        .transform(val => val || ""),
    url: z
        .string()
        .min(1, "La URL es obligatoria")
        .url("La URL debe ser válida")
        .trim(),
    type: z.enum(["video", "document", "image", "link"], {
        errorMap: () => ({ message: "Tipo de recurso inválido" })
    }),
    isVisible: z.boolean(),
    coverImage: z
        .string()
        .url("La URL de la imagen debe ser válida")
        .optional()
        .transform(val => val || ""),
});
// Validation function
export const validateResource = (data) => {
    try {
        resourceSchema.parse(data);
        return { success: true, errors: {} };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.reduce((acc, curr) => {
                const path = curr.path[0];
                acc[path] = curr.message;
                return acc;
            }, {});
            return { success: false, errors };
        }
        return { success: false, errors: { form: "Error de validación" } };
    }
};
