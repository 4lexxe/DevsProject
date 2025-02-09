import { z } from "zod";

export const contentTypes = [
    "Texto",
    "Video",
    "Imagen",
    "Archivo",
    "Link Externo",
    "Cuestionario",
] as const;

// Creamos un esquema que cambia dependiendo del `type`
export const contentSchema = z.discriminatedUnion("type", [
    // Tipo "Texto"
    z.object({
        type: z.literal("Texto"),
        contentText: z.string().nonempty("El texto es obligatorio"),
        contentTextTitle: z.string().nonempty("El título del texto es obligatorio"),
        contentVideo: z.string().optional(),
        contentVideoTitle: z.string().optional(),
        contentImage: z.string().optional(),
        contentImageTitle: z.string().optional(),
        contentFile: z.string().optional(),
        contentFileTitle: z.string().optional(),
        externalLink: z.string().optional(),
        externalLinkTitle: z.string().optional(),
        quizTitle: z.string().optional(),
        quizContent: z.string().optional(),
        questions: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),

    // Tipo "Video"
    z.object({
        type: z.literal("Video"),
        contentVideo: z.string().url("El video es obligatorio"),
        contentVideoTitle: z.string().nonempty("El título del video es obligatorio"),
        contentText: z.string().optional(),
        contentTextTitle: z.string().optional(),
        contentImage: z.string().optional(),
        contentImageTitle: z.string().optional(),
        contentFile: z.string().optional(),
        contentFileTitle: z.string().optional(),
        externalLink: z.string().optional(),
        externalLinkTitle: z.string().optional(),
        quizTitle: z.string().optional(),
        quizContent: z.string().optional(),
        questions: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),

    // Tipo "Imagen"
    z.object({
        type: z.literal("Imagen"),
        contentImage: z.string().url("La imagen es obligatoria"),
        contentImageTitle: z
            .string()
            .nonempty("El título de la imagen es obligatorio"),
        contentText: z.string().optional(),
        contentTextTitle: z.string().optional(),
        contentVideo: z.string().optional(),
        contentVideoTitle: z.string().optional(),
        contentFile: z.string().optional(),
        contentFileTitle: z.string().optional(),
        externalLink: z.string().optional(),
        externalLinkTitle: z.string().optional(),
        quizTitle: z.string().optional(),
        quizContent: z.string().optional(),
        questions: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),

    // Tipo "Archivo"
    z.object({
        type: z.literal("Archivo"),
        contentFile: z.string().url("Escribe una url válida").nonempty("El archivo es obligatorio"),
        contentFileTitle: z.string().nonempty("El título del archivo es obligatorio"),
        contentText: z.string().optional(),
        contentTextTitle: z.string().optional(),
        contentVideo: z.string().optional(),
        contentVideoTitle: z.string().optional(),
        contentImage: z.string().optional(),
        contentImageTitle: z.string().optional(),
        externalLink: z.string().optional(),
        externalLinkTitle: z.string().optional(),
        quizTitle: z.string().optional(),
        quizContent: z.string().optional(),
        questions: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),

    // Tipo "Link Externo"
    z.object({
        type: z.literal("Link Externo"),
        externalLink: z.string().url("El enlace externo es obligatorio"),
        externalLinkTitle: z
            .string()
            .nonempty("El título del enlace externo es obligatorio"),
        contentText: z.string().optional(),
        contentTextTitle: z.string().optional(),
        contentVideo: z.string().optional(),
        contentVideoTitle: z.string().optional(),
        contentImage: z.string().optional(),
        contentImageTitle: z.string().optional(),
        contentFile: z.string().optional(),
        contentFileTitle: z.string().optional(),
        quizTitle: z.string().optional(),
        quizContent: z.string().optional(),
        questions: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),

    // Tipo "Cuestionario"
    z.object({
        type: z.literal("Cuestionario"),
        quizTitle: z.string().nonempty("El título del cuestionario es obligatorio"),
        quizContent: z
            .string()
            .nonempty("El contenido del cuestionario es obligatorio"),
        questions: z
        .array(z.string()).min(1, { message: "Debe haber al menos una pregunta" })
        ,
        
        contentText: z.string().optional(),
        contentTextTitle: z.string().optional(),
        contentVideo: z.string().optional(),
        contentVideoTitle: z.string().optional(),
        contentImage: z.string().optional(),
        contentImageTitle: z.string().optional(),
        contentFile: z.string().optional(),
        contentFileTitle: z.string().optional(),
        externalLink: z.string().optional(),
        externalLinkTitle: z.string().optional(),
        duration: z.number().min(1, "Debe durar al menos 1 minuto").optional(),
        position: z.number().optional(),
    }),
]);

export type ContentType = z.infer<typeof contentSchema>;