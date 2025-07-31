import { z } from "zod"

export const discountEventSchema = z
  .object({
    event: z.string().min(1, "El nombre del evento es requerido").max(100, "Máximo 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(500, "Máximo 500 caracteres"),
    value: z.number().min(1, "El descuento debe ser mayor a 0").max(100, "El descuento no puede ser mayor a 100%"),
    startDate: z.date({
      message: "La fecha de inicio es requerida",
    }),
    endDate: z.date({
      message: "La fecha de fin es requerida",
    }),
    isActive: z.boolean(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  })

export type DiscountEventFormData = z.infer<typeof discountEventSchema>
