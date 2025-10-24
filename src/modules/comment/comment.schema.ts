import { z } from 'zod';

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido es obligatorio y debe tener al menos 1 caracteres'),
});

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido debe tener al menos 1 caracteres')
    .optional(),
});

export { createCommentSchema, updateCommentSchema };
