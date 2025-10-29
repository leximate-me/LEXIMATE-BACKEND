import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../libs/http-error';
import { logger } from '../configs/logger.config'; // Tu logger de Pino

/**
 * Middleware de manejo de errores global.
 * Captura todos los errores, los loguea de forma segura y envía una
 * respuesta JSON estandarizada.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction // _next es necesario para que Express lo identifique como middleware de error
) {
  // 1. Determinar el statusCode
  const statusCode = err.statusCode || 500;

  // 2. Extraer el ID de la petición (inyectado por httpLogger)
  // Hacemos un cast a 'any' o creamos un tipo extendido si prefieres
  const reqId = (req as any).id;

  // 3. Loguear el error con el formato correcto de Pino
  logger.error(
    {
      err: err,
      reqId: reqId,
      user: req.user ? (req.user as any).id || req.user : 'No autenticado',
      request: {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        ip: req.ip,
      },
    },

    err.message || 'Error no controlado en el middleware global'
  );

  // 4. Responder al cliente (Tu lógica original está bien)
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Respuesta para errores 500 genéricos
  return res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
  });
}
