import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const registerSchema = z
  .object({
    name: z.string()
      .min(1, { message: "Este campo no puede estar vacío" })
      .max(20, { message: "El nombre no puede exceder los 20 caracteres" })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: "Solo se permiten letras y espacios",
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
    phone: z 
      .string()
      .refine((value) => {
        const phone = parsePhoneNumberFromString(value, "AR");
        return phone?.isValid();
      }, "Número de teléfono inválido"),
    password: z
      .string()
      .min(1, {
        message: "Este campo no puede estar vacío",
      })
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/\d/, "Debe incluir al menos un número")
      .regex(
        /[@$!%*?&]/,
        "Debe incluir al menos un carácter especial (@$!%*?&)"
      ),
    confirmPassword: z.string().min(1, {
      message: "Este campo no puede estar vacío",
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones", 
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["confirmPassword"],
  });
