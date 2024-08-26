import { z } from 'zod';

const createTaskSchema = z.object({
  title: z
    .string('El título es obligatorio y debe tener al menos 3 caracteres')
    .min(3),
  description: z
    .string('La descripción es obligatoria y debe tener al menos 3 caracteres')
    .min(3),
  date: z
    .string(
      'La fecha es obligatoria y debe ser una fecha válida en el formato YYYY-MM-DD'
    )
    .datetime()
    .optional(),
});

const updateTaskSchema = z.object({
  title: z
    .string('El título es obligatorio y debe tener al menos 3 caracteres')
    .min(3)
    .optional(),
  description: z
    .string('La descripción es obligatoria y debe tener al menos 3 caracteres')
    .min(3)
    .optional(),
  date: z
    .string(
      'La fecha es obligatoria y debe ser una fecha válida en el formato YYYY-MM-DD'
    )
    .datetime()
    .optional(),
  completed: z
    .boolean(
      'El estado de completado debe ser un valor booleano (verdadero o falso)'
    )
    .optional(),
});

export { createTaskSchema, updateTaskSchema };
