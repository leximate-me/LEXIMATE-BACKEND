import { FastifyRequest, FastifyReply } from 'fastify';

const LOG_KEY = Symbol('log');

export interface LogConfig {
  logRequest?: boolean;
  logResponse?: boolean;
  logParams?: boolean;
}

export function Log(config: LogConfig = {}) {
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
      const logConfig = {
        logRequest: config.logRequest !== false,
        logResponse: config.logResponse !== false,
        logParams: config.logParams !== false,
      };

      if (logConfig.logRequest) {
        request.log.info(
          {
            method: request.method,
            path: request.url,
            params: logConfig.logParams ? request.params : undefined,
          },
          `Incoming request to ${propertyKey}`
        );
      }

      try {
        const result = await originalMethod.apply(this, [request, reply]);

        if (logConfig.logResponse) {
          request.log.info(
            { statusCode: reply.statusCode },
            `Response from ${propertyKey}`
          );
        }

        return result;
      } catch (error) {
        request.log.error({ error }, `Error in ${propertyKey}`);
        throw error;
      }
    };

    return descriptor;
  };
}
