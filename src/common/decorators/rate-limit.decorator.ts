import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '@common/libs/http-error';

const RATE_LIMIT_KEY = Symbol('rateLimit');

export interface RateLimitConfig {
  max: number;
  windowMs: number; // en milisegundos
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function RateLimit(config: RateLimitConfig) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {
      const ip = request.ip || 'unknown';
      const key = `${ip}-${propertyKey}`;
      const now = Date.now();

      let requestData = requestCounts.get(key);

      if (!requestData || now > requestData.resetTime) {
        requestCounts.set(key, {
          count: 1,
          resetTime: now + config.windowMs,
        });
      } else {
        if (requestData.count >= config.max) {
          throw HttpError.tooManyRequests(
            `Too many requests to ${propertyKey}. Maximum ${
              config.max
            } requests per ${config.windowMs / 1000} seconds`
          );
        }
        requestData.count++;
      }

      return originalMethod.apply(this, [request, reply]);
    };

    return descriptor;
  };
}
