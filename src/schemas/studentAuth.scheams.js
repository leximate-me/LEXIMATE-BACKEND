import { z } from 'zod';

const registerStudentSchema = z.object({
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
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    ),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$+!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial'
    ),
  role: z.string().optional(),
});

const loginStudentSchema = z.object({
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    ),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial'
    ),
});

export { registerStudentSchema, loginStudentSchema };
