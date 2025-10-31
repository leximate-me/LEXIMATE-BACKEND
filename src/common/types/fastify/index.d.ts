import { TokenPayload } from '../../interfaces/token-payload.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }

  interface FastifyInstance {
    config: {
      PORT: number;
      DB_PORT: number;
      DB_HOST: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      JWT_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      RESEND_API_KEY: string;
      FRONTEND_URL: string;
      FRONTEND_URL_PROD: string;
      NODE_ENV: string;
      LOG_LEVEL: string;
      N8N_CHAT_PROD_URL: string;
      N8N_CHAT_TEST_URL: string;
      N8N_RAG_PROD_URL: string;
      N8N_RAG_TEST_URL: string;
      IDRIVE_ENDPOINT: string;
      IDRIVE_PUBLIC_URL: string;
      IDRIVE_ACCESS_KEY: string;
      IDRIVE_SECRET_KEY: string;
      IDRIVE_BUCKET: string;
      KEY_FILE_PATH_GD: string;
      SCOPES_GD: string;
      GOOGLE_DRIVE_TASKS_FOLDER_ID: string;
      STORJ_ENDPOINT: string;
      STORJ_ACCESS_KEY: string;
      STORJ_SECRET_KEY: string;
      STORJ_BUCKET: string;
      STORJ_PUBLIC_ID: string;
    };
  }
}
