import { z } from "zod";
export const discountEventSchema = z
    .object({
    courseId: z.string().min(1, "Debe seleccionar un curso"),
    event: z.string().min(1, "El nombre del evento es requerido").max(100, "Máximo 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(500, "Máximo 500 caracteres"),
    value: z.number().min(1, "El descuento debe ser mayor a 0").max(100, "El descuento no puede ser mayor a 100%"),
    startDate: z.date({
        required_error: "La fecha de inicio es requerida",
    }),
    endDate: z.date({
        required_error: "La fecha de fin es requerida",
    }),
    isActive: z.boolean().default(true),
})
    .refine((data) => data.endDate > data.startDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
});
