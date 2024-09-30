import { z } from 'zod';

const registerUserSchema = z.object({
  first_name: z
    .string()
    .min(5, 'El nombre es obligatorio y debe tener al menos 5 caracteres'),
  last_name: z
    .string()
    .min(5, 'El apellido es obligatorio y debe tener al menos 5 caracteres'),
  dni: z
    .string()
    .min(7, 'El DNI es obligatorio y debe tener al menos 7 caracteres'),
  institute: z
    .string()
    .min(2, 'El instituto es obligatorio y debe tener al menos 2 caracteres'),
  phone_number: z.string().min(10, 'El número de teléfono es obligatorio'),
  birth_date: z.string().min(10, 'La fecha de nacimiento es obligatoria'),
  user_name: z
    .string()
    .min(
      10,
      'El nombre de usuario es obligatorio  y debe tener al menos 10 caracteres'
    ),
  email: z.string().email('El email es obligatorio y debe ser válido'),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_?*$])/,
      'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número'
    ),
  role: z.string().min(1, 'El rol es obligatorio'),
});

const loginUserSchema = z.object({
  email: z.string().email('El email debe ser válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export { loginUserSchema, registerUserSchema };
