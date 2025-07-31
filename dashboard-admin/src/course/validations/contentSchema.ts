import { z } from "zod";

const resourceSchema = z.object({
  title: z.string().min(3, "El título debe tener minimo 3 caracteres"),
  url: z.string().url("Debe ser una URL válida")
});

export const contentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  text: z.string().min(10, "El texto debe tener minimo 10 caracteres"),
  markdown: z.string().optional(),
  resources: z.array(resourceSchema).optional(),
  duration: z.number().positive("La duración debe ser mayor a 0"),
  position: z.number().min(0, "La posición debe ser mayor o igual a 0"),
});
