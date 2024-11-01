import { z } from 'zod';

const createCommentSchema = z.object({
  content: z
    .string()
    .min(5, 'El contenido es obligatorio y debe tener al menos 5 caracteres'),
});

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(5, 'El contenido debe tener al menos 5 caracteres')
    .optional(),
});

export { createCommentSchema, updateCommentSchema };
