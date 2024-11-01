import { z } from 'zod';

const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'El título es obligatorio y debe tener al menos 5 caracteres'),
  content: z
    .string()
    .min(10, 'El contenido es obligatorio y debe tener al menos 10 caracteres'),
});

const updatePostSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .optional(),
  content: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .optional(),
});

export { createPostSchema, updatePostSchema };
