import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Este campo no puede estar vacío",
  }),
  email: z
    .string()
    .min(1, {
      message: "Este campo no puede estar vacío",
    })
    .email({ 
      message:
        "Por favor, introduce una dirección de correo electrónico válida.",
    }),

  phone: z.string().min(1, {
    message: "Este campo no puede estar vacío",
  }),
  password: z
    .string()
    .min(1, {
      message: "Este campo no puede estar vacío",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
  confirmPassword: z
    .string()
    .min(1, {
      message: "Este campo no puede estar vacío",
    }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones"
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas deben coincidir",
  path: ["confirmPassword"]
});
