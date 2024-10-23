import { z } from 'zod';

const createClassSchema = z.object({
  name: z
    .string()
    .min(5, 'El nombre es obligatorio y debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(
      10,
      'La descripción es obligatoria y debe tener al menos 10 caracteres'
    ),
});

const updateClassSchema = z.object({
  name: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .optional(),
  description: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .optional(),
});

export { createClassSchema, updateClassSchema };
