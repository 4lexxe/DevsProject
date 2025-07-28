import { z } from "zod";


//Si en un futuro se necesita usar Zod para validar el registro de un nuevo admin, se puede descomentar
/*export const registerSchemaZod = z
  .object({
    username: z
      .string()
      .nonempty({ message: "Username requerido" })
      .min(4, { message: "El nombre debe tener al menos 4 caracteres" })
      .max(20, { message: "El nombre no puede tener más de 20 caracteres" }),
    email: z
      .string()
      .nonempty({ message: "Email requerido" })
      .email({ message: "Email inválido" })
      .refine(async (email) => {
        // Verificar que el email NO exista en la base de datos
        const exists = await checkIfEmailExists(email);
        return !exists;
      }, "Este email ya está registrado"),
    phoneNumber: z
      .string()
      .nonempty({ message: "Nro. Celular requerido" })
      .min(7, { message: "El número debe tener al menos 7 dígitos" })
      .max(15, { message: "El número no puede tener más de 15 dígitos" }),
    password: z
      .string()
      .nonempty({ message: "Contraseña requerida" })
      .min(7, { message: "La clave debe tener al menos 7 dígitos" })
      .max(32, { message: "La clave no puede tener más de 32 dígitos" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirmar contraseña requerido" }),
    checkbox: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben ser iguales",
    path: ["confirmPassword"],
  });

export type FormInputRegisterZod = z.infer<typeof registerSchemaZod>;*/

export const loginSchemaZod = z
  .object({
    email: z
      .string()
      .nonempty({ message: "Email es requerido" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .nonempty({ message: "Contraseña requerida" })
      .min(7, { message: "La clave debe tener al menos 7 dígitos" })
      .max(32, { message: "La clave no puede tener más de 32 dígitos" }),
  });

export type FormInputLoginZod = z.infer<typeof loginSchemaZod>;
