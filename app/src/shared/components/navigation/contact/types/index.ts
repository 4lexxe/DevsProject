import { z } from "zod";


// Definir el esquema de validación con zod
export const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

// Inferir el tipo desde el esquema de zod
export type FormData = z.infer<typeof formSchema>;