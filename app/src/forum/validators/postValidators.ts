import { z } from 'zod';
import { ContentType } from '../services/forumPost.service';

// Esquema base para todos los posts
export const basePostSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(100, { message: 'El título debe tener máximo 100 caracteres' }),
  content: z.string().min(10, { message: 'El contenido debe tener al menos 10 caracteres' }),
  categoryId: z.number({ required_error: 'La categoría es obligatoria' }),
  isNSFW: z.boolean().optional().default(false),
  isSpoiler: z.boolean().optional().default(false),
  contentType: z.nativeEnum(ContentType)
});

// Esquema para posts de tipo LINK
export const linkPostSchema = basePostSchema.extend({
  linkUrl: z.string().url({ message: 'Debe ser una URL válida' }),
  contentType: z.literal(ContentType.LINK)
});

// Esquema para posts de tipo IMAGE
export const imagePostSchema = basePostSchema.extend({
  imageUrl: z.string().url({ message: 'Debe ser una URL válida para la imagen' }).optional(),
  contentType: z.literal(ContentType.IMAGE)
});

// Esquema para posts de tipo TEXT
export const textPostSchema = basePostSchema.extend({
  contentType: z.literal(ContentType.TEXT)
});

// Esquema unificado que valida según el tipo de contenido
export const postSchema = z.discriminatedUnion('contentType', [
  textPostSchema,
  imagePostSchema,
  linkPostSchema,
]);

// Tipo extraído del esquema para el formulario
export type FormValues = z.infer<typeof postSchema>;

// Tipo para facilitar el acceso a los campos de error
export type FieldErrorWithMessage = {
  message?: string;
};

// Tipo para errores de formulario que incluye todos los campos posibles
export type ErrorRecord = {
  title?: FieldErrorWithMessage;
  content?: FieldErrorWithMessage;
  categoryId?: FieldErrorWithMessage;
  isNSFW?: FieldErrorWithMessage;
  isSpoiler?: FieldErrorWithMessage;
  contentType?: FieldErrorWithMessage;
  linkUrl?: FieldErrorWithMessage;
  imageUrl?: FieldErrorWithMessage;
  [key: string]: FieldErrorWithMessage | undefined;
};
