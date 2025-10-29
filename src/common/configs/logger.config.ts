import pino from 'pino';
import pinoHttp from 'pino-http';
import os from 'os';
import { EnvConfiguration } from './env.config';

// --- LA SOLUCIÓN: FORZAR UTF-8 EN EL STREAM DE SALIDA ---
// Esto le dice a Node.js que use UTF-8 para todas las salidas
// de 'stdout', incluyendo las tuberías a los transportes.
process.stdout.setEncoding('utf8');

const isDevelopment = EnvConfiguration().nodeEnv !== 'production';

// Función para generar un ID de petición (más robusto que solo el timestamp)
const genReqId = (req) =>
  req.headers['x-request-id'] ||
  Date.now().toString(36) + Math.random().toString(36).substring(2);

// --- Logger General (para errores de código, logs de servicio) ---

const logger = pino({
  // **Añadir Nombre del Servicio** para identificar el origen
  name: 'LEXI-API',
  level: EnvConfiguration().logLevel || 'info',
  // base: null, // Evita las propiedades 'pid', 'hostname', 'v' por defecto
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },

  // **Transporte para Desarrollo (pino-pretty)**
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: false,

          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname,v', // Quitamos 'name' para que se muestre
          // **Formato Descriptivo:** Muestra el nombre del servicio y el mensaje
          messageFormat: '{msg}',
          // **NO ocultar el objeto:** Vital para que los errores se muestren con el stack
          hideObject: false,
          customColors: 'info:green,warn:yellow,error:red,debug:magenta',
        },
      }
    : undefined, // En producción usa el JSON plano por defecto
});

// --- Logger HTTP (para peticiones y respuestas) ---

const httpLogger = pinoHttp({
  logger: logger,
  // **ID de Petición:** Útil para correlacionar logs de una misma request
  genReqId: genReqId,

  // **Nivel de Log Personalizado:**
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500 || err) return 'error'; // Error de servidor o excepción
    if (res.statusCode >= 400) return 'warn'; // Errores del cliente (ej. 404, 401)
    return 'info';
  },

  // **Mensaje de Éxito Descriptivo:** Incluye el tiempo de respuesta (latencia)
  customSuccessMessage: (req, res) =>
    `(${res.statusCode}) ${req.method} ${req.url} `,

  customErrorMessage: (req, res) =>
    `ERROR (${res.statusCode}) ${req.method} ${req.url}`,

  // **Propiedades Personalizadas:** Contexto del cliente y servidor
  customProps: (req, res) => ({
    // Se usa 'req.id' que se genera con 'genReqId'
    reqId: req.id,
    user_agent: req.headers['user-agent'],
    hostname: os.hostname(),
    ip: req.socket.remoteAddress,
  }),

  // **Serializadores:** Solo incluimos la información esencial de req/res
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      query: req.query,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),

    err: pino.stdSerializers.err,
  },
});

export { logger, httpLogger };
