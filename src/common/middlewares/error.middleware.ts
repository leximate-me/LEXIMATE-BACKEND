import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../libs/http-error';
import { logger } from '../configs/logger.config';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = (error as any).statusCode || 500;
  const reqId = (request as any).id;

  logger.error(
    {
      err: error,
      reqId: reqId,
      user: (request as any).user
        ? (request as any).user.id || (request as any).user
        : 'No autenticado',
      request: {
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query,
        ip: request.ip,
      },
    },
    error.message || 'Error no controlado en el middleware global'
  );

  if (error instanceof HttpError) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  reply.status(500).send({
    statusCode: 500,
    message: 'Error interno del servidor',
  });
}
