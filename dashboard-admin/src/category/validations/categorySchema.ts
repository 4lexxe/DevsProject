import { z } from 'zod'

// Esquema de validación para categorías
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  
  icon: z
    .string()
    .min(1, 'El ícono es requerido')
    .max(50, 'El ícono no puede exceder 50 caracteres')
    .trim(),
  
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim(),
  
  isActive: z
    .boolean()
    .default(true)
})

// Esquema para actualización (todos los campos opcionales excepto validaciones)
export const updateCategorySchema = categorySchema.partial()

// Esquema para filtros
export const categoryFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional()
})

// Tipos derivados de los esquemas
export type CategoryFormData = z.infer<typeof categorySchema>
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>
export type CategoryFiltersData = z.infer<typeof categoryFiltersSchema>

// Función de validación personalizada
export const validateCategory = (data: unknown) => {
  try {
    return {
      success: true,
      data: categorySchema.parse(data),
      errors: null
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Error de validación desconocido' }
    }
  }
}

// Función de validación para actualización
export const validateUpdateCategory = (data: unknown) => {
  try {
    return {
      success: true,
      data: updateCategorySchema.parse(data),
      errors: null
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Error de validación desconocido' }
    }
  }
}

// Validaciones específicas
export const isValidCategoryName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100
}

export const isValidCategoryDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 500
}

export const isValidCategoryIcon = (icon: string): boolean => {
  return icon.trim().length >= 1 && icon.trim().length <= 50
}