import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../libs/http-error';
import { logger } from '../configs/logger.config';

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
      status: err.statusCode || 500,
      message: err.message,
      stack: err.stack,
    },
    'Error en middleware global'
  );

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
  });
}
