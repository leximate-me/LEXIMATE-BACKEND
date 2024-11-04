import dotenv from 'dotenv';
dotenv.config();

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Falta la variable de entorno: ${key}`);
  }
  return value;
};

const PORT = getEnvVar('PORT');
const DB_HOST = getEnvVar('DB_HOST');
const DB_USER = getEnvVar('DB_USER');
const DB_NAME = getEnvVar('DB_NAME');
const DB_PASSWORD = getEnvVar('DB_PASSWORD');

const JWT_SECRET = getEnvVar('JWT_SECRET');
const CLOUDINARY_CLOUD_NAME = getEnvVar('CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_API_KEY = getEnvVar('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = getEnvVar('CLOUDINARY_API_SECRET');
const RESEND_API_KEY = getEnvVar('RESEND_API_KEY');
const FRONTEND_URL = getEnvVar('FRONTEND_URL');
const ILOVEPDF_API_SECRET_KEY = getEnvVar('ILOVEPDF_API_SECRET_KEY');
const ILOVEPDF_API_PUBLIC_KEY = getEnvVar('ILOVEPDF_API_PUBLIC_KEY');

export {
  PORT,
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  RESEND_API_KEY,
  FRONTEND_URL,
  ILOVEPDF_API_SECRET_KEY,
  ILOVEPDF_API_PUBLIC_KEY,
};
