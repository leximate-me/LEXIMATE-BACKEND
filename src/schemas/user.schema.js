import { z } from 'zod';

const registerUserSchema = z.object({
  first_name: z.string().min(2, 'El nombre es obligatorio'),
  last_name: z.string().min(2, 'El apellido es obligatorio'),
  dni: z.string().min(7, 'El DNI es obligatorio'),
  institute: z.string().min(2, 'El instituto es obligatorio'),
  phone_number: z.string().min(10, 'El número de teléfono es obligatorio'),
  birth_date: z.string().min(10, 'La fecha de nacimiento es obligatoria'),
  user_name: z.string().min(2, 'El nombre de usuario es obligatorio'),
  email: z.string().email('El email es obligatorio y debe ser válido'),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
  role: z.string().min(1, 'El rol es obligatorio'),
});

const loginUserSchema = z.object({
  email: z.string().email('El email es obligatorio y debe ser válido'),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
});

export { loginUserSchema, registerUserSchema };
