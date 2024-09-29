import { z } from 'zod';

const loginUserSchema = z.object({
  email: z.string().email('El email es obligatorio y debe ser válido'),
  password: z
    .string()
    .min(8, 'La contraseña es obligatoria y debe tener al menos 8 caracteres'),
});

export { loginUserSchema };
