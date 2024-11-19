import { z } from 'zod';

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio y debe tener al menos 1 caracteres'),
  content: z
    .string()
    .min(2, 'El contenido es obligatorio y debe tener al menos 2 caracteres'),
});

const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'El título debe tener al menos 2 caracteres')
    .optional(),
  content: z
    .string()
    .min(2, 'El contenido debe tener al menos 2 caracteres')
    .optional(),
});

export { createPostSchema, updatePostSchema };
