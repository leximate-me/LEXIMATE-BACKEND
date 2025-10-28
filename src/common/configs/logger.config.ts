// logger.js
import pino from 'pino';
import pinoHttp from 'pino-http';

// Define si estamos en producción.
// Esto es clave para decidir si usar pino-pretty.
const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  // Nivel de log por defecto.
  level: process.env.LOG_LEVEL || 'info',

  // Usar 'message' en lugar de 'msg' para mayor claridad
  messageKey: 'message',

  // Usar pino-pretty SÓLO si no estamos en producción
  transport: isDevelopment
    ? {
        target: 'pino-pretty',

        options: {
          // Opciones de formato claro y descriptivo
          colorize: true,
          levelFirst: true,
          translateTime: 'HH:MM:ss', // Formato de fecha y hora detallado
          ignore: 'pid,name,v', // Ignorar campos ruidosos
          messageKey: 'message',

          messageFormat:
            '{level} ({responseTime}ms) {req.method} {url} - {statusCode} | {message}',
          hideObject: false,
        },
      }
    : undefined, // En producción, se omite el transport (JSON puro y rápido)
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
