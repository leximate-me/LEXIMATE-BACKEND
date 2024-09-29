import { z } from 'zod';

const loginUserSchema = z.object({
  user_name: z.string(
    'El nombre de usuario es obligatorio y debe tener al menos 4 caracteres'
  ),
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    )
    .optional(),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
});

export { loginUserSchema };
