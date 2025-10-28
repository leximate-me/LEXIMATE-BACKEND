// logger.js
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import pinoHttp from 'pino-http';

// Define si estamos en producción.
// Esto es clave para decidir si usar pino-pretty.
const isDevelopment = process.env.NODE_ENV !== 'production';

const stream = isDevelopment
  ? pinoPretty({
      colorize: true,
      levelFirst: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,name,v',
      messageKey: 'message',
      messageFormat:
        '({responseTime}ms) {req.method} {url} |> {statusCode} {msg}',
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
    if (res.statusCode >= 400) return 'warn'; // Advertencia (amarillo/naranja) para 4xx
    return 'info'; // Información (verde/azul) para 2xx/3xx
  },

  // ✨ MEJORA CLAVE: Usamos customSuccessMessage para diferenciar 2xx de 4xx/3xx
  customSuccessMessage: (req, res) => {
    if (res.statusCode >= 400) {
      // Mensaje claro para errores de cliente (e.g., 404 Not Found, 401 Unauthorized)
      return `CLIENT ERROR (${res.statusCode}): ${req.method} ${req.url}`;
    }
    // Mensaje para éxito real (2xx)
    return `SUCCESS (${res.statusCode}): ${req.method} ${req.url}`;
  },

  // Mantén customErrorMessage para 5xx (rojo)
  customErrorMessage: (req, res) =>
    `SERVER ERROR (${res.statusCode}): ${req.method} ${req.url}`,

  // Añade campos útiles al log HTTP:
  customProps: (req, res) => ({
    user_agent: req.headers['user-agent'],
  }),

  // Personaliza los campos que se registran por pino-http (opcional)
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      body: req.raw.body, // Descomentar solo si usas body-parser y quieres registrar el body
    }),
  },
});
