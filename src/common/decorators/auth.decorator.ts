import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '@common/libs/http-error';

const AUTH_REQUIRED_KEY = Symbol('authRequired');

export function Auth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(AUTH_REQUIRED_KEY, true, target, propertyKey);
    return descriptor;
  };
}

export function isAuthRequired(target: any, propertyKey: string): boolean {
  return Reflect.getMetadata(AUTH_REQUIRED_KEY, target, propertyKey) || false;
}

export async function checkAuth(request: FastifyRequest): Promise<string> {
  const userId = (request.user as any)?.id;

  if (!userId) {
    throw HttpError.unauthorized('User authentication required');
  }

  return userId;
}
