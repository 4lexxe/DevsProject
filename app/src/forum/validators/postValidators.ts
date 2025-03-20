import { z } from 'zod';
import { ContentType } from '../services/forumPost.service';

// Esquema base para todos los posts
const basePostSchema = {
  title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres' }).max(150, { message: 'El título no debe exceder los 150 caracteres' }),
  content: z.string().min(10, { message: 'El contenido debe tener al menos 10 caracteres' }),
  categoryId: z.number().min(1, { message: 'Debes seleccionar una categoría' }),
  flairId: z.number().optional(),
  isNSFW: z.boolean().default(false),
  isSpoiler: z.boolean().default(false),
};

// Esquema para posts de tipo TEXT
export const textPostSchema = z.object({
  ...basePostSchema,
  contentType: z.literal(ContentType.TEXT),
});

// Esquema para posts de tipo IMAGE
export const imagePostSchema = z.object({
  ...basePostSchema,
  contentType: z.literal(ContentType.IMAGE),
  imageUrl: z.string().url({ message: 'Debe ser una URL válida' }).min(1, { message: 'La URL de la imagen es obligatoria' }),
  // En el modelo DB se almacenará como array, pero en el formulario seguimos usando string para simplificar
  // En la versión futura podremos usar z.array(z.string().url()).min(1) para validar múltiples imágenes
});

// Esquema para posts de tipo LINK
export const linkPostSchema = z.object({
  ...basePostSchema,
  contentType: z.literal(ContentType.LINK),
  linkUrl: z.string().url({ message: 'Debe ser una URL válida' }),
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
