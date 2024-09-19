import { z } from 'zod';

const loginUserSchema = z.object({
  email: z
    .string()
    .email(
      'El correo electrónico es obligatorio y debe ser una dirección de correo válida'
    ),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
});

export { loginUserSchema };
