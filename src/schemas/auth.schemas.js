import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name is required and must be at least 3 characters long')
    .regex(
      /^[a-zA-Z]+$/,
      'Name must not contain numbers or special characters'
    ),
  lastname: z
    .string()
    .min(3, 'Lastname is required and must be at least 3 characters long')
    .regex(
      /^[a-zA-Z]+$/,
      'Lastname must not contain numbers or special characters'
    ),
  gender: z
    .string()
    .min(4, 'Gender is required and must be at least 4 characters long'),
  birthdate: z
    .string(
      'Birthdate is required and must be a valid date in the format YYYY-MM-DD'
    )
    .datetime()
    .optional(),
  country: z
    .string()
    .min(3, 'Country is required and must be at least 3 characters long'),
  email: z
    .string()
    .email('Email is required and must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password is required and must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    ),
  role: z.string().optional(),
});

const loginSchema = z.object({
  email: z
    .string()
    .email('Email is required and must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password is required and must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

export { registerSchema, loginSchema };
