import { TokenPayload } from '../../interfaces/token-payload.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }

  interface FastifyInstance {
    getEnvs<T = Record<string, unknown>>(): T;
    config: {
      PORT: number;
      HOST: string;
      DB_PORT: number;
      DB_HOST: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      JWT_SECRET_KEY: string;
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
      N8N_API_URL: string;
      N8N_API_KEY: string;
      N8N_ENCRYPTION_KEY: string;
      N8N_JWT_SECRET: string;
      GOOGLE_PALM_HOST: string;
      GOOGLE_GEMINI_API_KEY: string;
      SUPABASE_HOST: string;
      SERVICE_ROLE_SECRET: string;
      POSTGRES_DB_HOST: string;
      POSTGRES_DB_PORT: number;
      POSTGRES_DB_NAME: string;
      POSTGRES_DB_USER: string;
      POSTGRES_DB_PASSWORD: string;
      POSTGRES_DB_SSL: boolean;
    };
  }
}
