import { z } from 'zod';

const createClassSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio y debe tener al menos 1 caracteres'),
  description: z
    .string()
    .min(2, 'La descripción es obligatoria y debe tener al menos 2 caracteres'),
});

const updateClassSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre debe tener al menos 1 caracteres')
    .optional(),
  description: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .optional(),
});

export { createClassSchema, updateClassSchema };
