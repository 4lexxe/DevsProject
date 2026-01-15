import { z } from 'zod';

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
  
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  
  permissionIds: z.array(z.number())
});

export type RoleSchemaType = z.infer<typeof roleSchema>;
