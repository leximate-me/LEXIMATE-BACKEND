import { z } from 'zod';

const createTaskSchema = z.object({
  title: z
    .string()
    .min(4, 'El nombre es obligatorio y debe tener al menos 4 caracteres'),
  description: z
    .string()
    .min(3, 'La descripción es obligatoria y debe tener al menos 3 caracteres'),
  status: z.boolean().optional(),
  due_date: z
    .string()
    .min(
      10,
      'La fecha de vencimiento es obligatoria y debe tener al menos 10 caracteres'
    ),
});

// Esquema para actualizar una tarea
const updateTaskSchema = z.object({
  title: z.string().min(4, 'El nombre debe tener al menos 1 caracteres'),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 2 caracteres'),
  status: z.boolean(),
  due_date: z
    .string()
    .min(10, 'La fecha de vencimiento debe tener al menos 10 caracteres'),
});

export { createTaskSchema, updateTaskSchema };
