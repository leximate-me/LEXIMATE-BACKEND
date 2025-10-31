const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  level: process.env.LOG_LEVEL || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,
};

export { logger };
