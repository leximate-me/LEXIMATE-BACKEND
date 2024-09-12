import { z } from 'zod';

const registerTeacherSchema = z.object({
  firstName: z
    .string()
    .min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-Z]+$/,
      'El nombre no debe contener números ni caracteres especiales'
    ),
  lastName: z
    .string()
    .min(3, 'El apellido es obligatorio y debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-Z]+$/,
      'El apellido no debe contener números ni caracteres especiales'
    ),

  dni: z
    .string()
    .min(3, 'El DNI es obligatorio y debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El DNI no debe contener caracteres especiales'),
  birthdate: z
    .string({
      required_error: 'La fecha de nacimiento es obligatoria',
    })
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Debe ser una fecha válida en el formato YYYY-MM-DD'
    )
    .optional(),
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    ),
  phone: z
    .string()
    .min(10, 'El teléfono es obligatorio y debe tener al menos 10 caracteres')
    .regex(
      /^\+?\d{1,3}[-\s]?\d{1,4}[-\s]?\d{1,4}[-\s]?\d{1,9}$/,
      'El teléfono no debe contener letras ni caracteres especiales'
    ),
  institution: z
    .string()
    .min(3, 'La institución es obligatoria y debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$+!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial'
    ),
});

const loginTeacherSchema = z.object({
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    ),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
});

export { registerTeacherSchema, loginTeacherSchema };
