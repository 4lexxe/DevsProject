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
  .refine((data) => {
    const today = new Date();
    
    // Para evitar problemas de zona horaria, trabajar con fechas locales
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Si la fecha viene con offset de zona horaria, ajustar para obtener la fecha real seleccionada
    const startDateAdjusted = new Date(data.startDate.getTime() + data.startDate.getTimezoneOffset() * 60000);
    const startDateLocal = new Date(
      startDateAdjusted.getFullYear(),
      startDateAdjusted.getMonth(), 
      startDateAdjusted.getDate()
    );
    
    return startDateLocal >= todayLocal;
  }, {
    message: "La fecha de inicio debe ser hoy o en el futuro",
    path: ["startDate"],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  })

export type DiscountEventFormData = z.infer<typeof discountEventSchema>
