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
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname,reqId,service,req,res,level',
            singleLine: false,
            quietReqLogger: true,
            customColors:
              'trace:gray,debug:cyan,info:green,warn:yellow,error:red,fatal:magenta',
          },
        }
      : undefined,
  };
}

export const logger = getLoggerOptions();
