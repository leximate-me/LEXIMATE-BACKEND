import dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const EnvConfiguration = () => ({
  port: env.get('PORT').asPortNumber(),
  dbPort: env.get('DB_PORT').asPortNumber(),
  dbHost: env.get('DB_HOST').asString(),
  dbUser: env.get('DB_USER').asString(),
  dbName: env.get('DB_NAME').asString(),
  dbPassword: env.get('DB_PASSWORD').asString(),
  jwtSecret: env.get('JWT_SECRET').asString(),
  cloudinaryCloudName: env.get('CLOUDINARY_CLOUD_NAME').asString(),
  cloudinaryApiKey: env.get('CLOUDINARY_API_KEY').asString(),
  cloudinaryApiSecret: env.get('CLOUDINARY_API_SECRET').asString(),
  resendApiKey: env.get('RESEND_API_KEY').asString(),
  frontendUrl: env.get('FRONTEND_URL').asString(),
  frontendUrlProd: env.get('FRONTEND_URL_PROD').asString(),
});
