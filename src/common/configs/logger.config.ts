import { EnvConfiguration } from './env.config';

const isDevelopment = EnvConfiguration().nodeEnv !== 'production';

const logger = {
  level: EnvConfiguration().logLevel || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l Z',
          ignore: 'pid,hostname',
          singleLine: false, // Para que los objetos se vean en varias líneas
        },
      }
    : undefined, // Producción: JSON plano
};

export { logger };
