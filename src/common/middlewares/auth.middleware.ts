import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../libs/http-error';

export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = (request.user as any)?.rol;
    if (!userRole || !roles.includes(userRole)) {
      reply.code(403).send({
        message: 'No tienes permisos para acceder a esta ruta.',
      });
      return;
    }
  };
}
