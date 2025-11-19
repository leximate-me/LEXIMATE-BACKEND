export function getLoggerOptions() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    level: process.env.LOG_LEVEL || 'info',
    base: undefined,
    disableRequestLogging: true,
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            // ✅ Timestamp legible
            translateTime: 'HH:MM:ss',
            // ✅ Ignorar campos innecesarios
            ignore: 'pid,hostname,level,time',
            // ✅ Mostrar solo el mensaje
            singleLine: false,
            quietReqLogger: true,
            // ✅ Sin prefijo de nivel
            levelFirst: false,
          },
        }
      : undefined,
  };
}

export const logger = getLoggerOptions();
