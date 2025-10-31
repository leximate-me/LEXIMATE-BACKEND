import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../libs/http-error';

export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = (request.user as any)?.rol;
    if (!userRole || !roles.includes(userRole)) {
      throw HttpError.unauthorized('Insufficient permissions');
      return;
    }
  };
}
