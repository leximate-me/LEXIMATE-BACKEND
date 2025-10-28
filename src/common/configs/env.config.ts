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
  nodeEnv: env.get('NODE_ENV').asString(),
  logLevel: env.get('LOG_LEVEL').asString(),
  n8nChatProdUrl: env.get('N8N_CHAT_PROD_URL').asUrlString(),
  n8nChatTestUrl: env.get('N8N_CHAT_TEST_URL').asUrlString(),
  n8nRagProdUrl: env.get('N8N_RAG_PROD_URL').asUrlString(),
  n8nRagTestUrl: env.get('N8N_RAG_TEST_URL').asUrlString(),
  iDriveEndpoint: env.get('IDRIVE_ENDPOINT').asUrlString(),
  iDrivePublicUrl: env.get('IDRIVE_PUBLIC_URL').asUrlString(),
  iDriveAccessKey: env.get('IDRIVE_ACCESS_KEY').asString(),
  iDriveSecretKey: env.get('IDRIVE_SECRET_KEY').asString(),
  iDriveBucket: env.get('IDRIVE_BUCKET').asString(),
  keyFilePathGD: env.get('KEY_FILE_PATH_GD').asString(),
  scopesGD: env.get('SCOPES_GD').asString(),
  googleDriveTasksFolderId: env.get('GOOGLE_DRIVE_TASKS_FOLDER_ID').asString(),
  storjEndpoint: env.get('STORJ_ENDPOINT').asUrlString(),
  storjAccessKey: env.get('STORJ_ACCESS_KEY').asString(),
  storjSecretKey: env.get('STORJ_SECRET_KEY').asString(),
  storjBucket: env.get('STORJ_BUCKET').asString(),
  storjPublicId: env.get('STORJ_PUBLIC_ID').asString(),
});
