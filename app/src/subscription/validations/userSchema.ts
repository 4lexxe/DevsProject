import { z } from "zod";

export const userSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  surname: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),
  email: z.string()
    .email("El email no tiene un formato válido"),
  identificationNumber: z.string()
    .min(7, "El número de documento debe tener al menos 7 dígitos")
    .max(11, "El número de documento no puede tener más de 11 dígitos")
    .regex(/^\d+$/, "El número de documento debe contener solo números"),
  identificationType: z.enum(["CUIT", "CUIL", "DNI"], {
    errorMap: () => ({ message: "El tipo de documento es requerido" })
  })
});
