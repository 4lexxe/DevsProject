import { z } from "zod";
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, {
        message: "Este campo no puede estar vacío",
    })
        .email({
        message: "Por favor, introduce una dirección de correo electrónico válida.",
    }),
    password: z
        .string()
        .min(1, {
        message: "Este campo no puede estar vacío",
    })
        .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
    }),
});
