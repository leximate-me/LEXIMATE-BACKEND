import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../libs/http-error';
import { logger } from '../configs/logger.config'; // Ajusta la ruta según tu estructura

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(
    {
      path: req.path,
      method: req.method,
      status: err.status || 500,
      message: err.message,
      stack: err.stack,
      details: err.details,
    },
    'Error en middleware global'
  );
  console.log(err);
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: [err.message], details: err.details });
  }

  res.status(500).json({ error: ['Error interno del servidor'] });
}
