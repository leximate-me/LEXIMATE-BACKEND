import pino from 'pino';
import pinoPretty from 'pino-pretty';
import pinoHttp from 'pino-http';

const isDevelopment = process.env.NODE_ENV !== 'production';

const stream = isDevelopment
  ? pinoPretty({
      colorize: true,
      levelFirst: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,name,v',
      messageKey: 'message',
      messageFormat:
        '({responseTime}ms) {req.method} {url} <|> {statusCode} {msg}',
      hideObject: false,
      customColors: 'info:green,warn:yellow,error:red,debug:magenta',
      customPrettifiers: {
        responseTime: (value) => `${value}ms`,
        hostname: (value) => `🏷️ ${value}`,
      },
    })
  : undefined;

export const logger = isDevelopment
  ? pino(
      {
        level: process.env.LOG_LEVEL || 'info',
        base: null,
      },
      stream
    )
  : pino({
      level: process.env.LOG_LEVEL || 'info',
      base: null,
    });

export const httpLogger = pinoHttp({
  logger: logger,

  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  customSuccessMessage: (req, res) => {
    if (res.statusCode >= 400) {
      return `CLIENT ERROR (${res.statusCode}): ${req.method} ${req.url}`;
    }

    return `SUCCESS (${res.statusCode}): ${req.method} ${req.url}`;
  },

  customErrorMessage: (req, res) =>
    `SERVER ERROR (${res.statusCode}): ${req.method} ${req.url}`,

  customProps: (req, res) => ({
    user_agent: req.headers['user-agent'],
  }),

  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      body: req.raw.body,
    }),
  },
});
