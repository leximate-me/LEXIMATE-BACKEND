import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../libs/http-error';

import { RoleEnum } from '../enums/role.enum';

export function requireRole(roles: RoleEnum | RoleEnum[] | string | string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.rol;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw HttpError.unauthorized('Insufficient permissions');
    }
  };
}
