import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  export interface FastifyRequest {
    correlationId: string;
    startTime: number;
  }
}

export interface LoggerOptions {
  level?: string;
}

// ✅ Función auxiliar para obtener emoji según el método HTTP
function getMethodEmoji(method: string): string {
  const emojis: Record<string, string> = {
    GET: '📥',
    POST: '📤',
    PUT: '✏️',
    DELETE: '🗑️',
    PATCH: '🔧',
    HEAD: '👀',
    OPTIONS: '⚙️',
  };
  return emojis[method] || '📡';
}

// ✅ Función auxiliar para obtener emoji según el status code
function getStatusEmoji(statusCode: number): string {
  if (statusCode < 300) return '✅';
  if (statusCode < 400) return '🔀';
  if (statusCode < 500) return '⚠️';
  return '❌';
}

// ✅ Función auxiliar para obtener emoji según el tipo de error
function getErrorEmoji(statusCode: number): string {
  if (statusCode === 400) return '❌'; // Bad Request
  if (statusCode === 401) return '🔐'; // Unauthorized
  if (statusCode === 403) return '🚫'; // Forbidden
  if (statusCode === 404) return '🔍'; // Not Found
  if (statusCode === 409) return '⚔️'; // Conflict
  if (statusCode === 422) return '✔️'; // Unprocessable Entity
  if (statusCode === 429) return '⏱️'; // Too Many Requests
  if (statusCode >= 500) return '💥'; // Server Error
  return '⚠️';
}

// ✅ Función auxiliar para formatear stack trace
function formatStackTrace(stack?: string): string[] {
  if (!stack) return [];
  return stack
    .split('\n')
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function loggerPlugin(
  fastify: FastifyInstance,
  options: LoggerOptions = {}
) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    fastify.log.info('🔧 Logger plugin initialized');
  }

  // Incoming request hook
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const correlationId =
        (request.headers['x-request-id'] as string) || randomUUID();
      const startTime = Date.now();

      request.correlationId = correlationId;
      request.startTime = startTime;
      reply.header('X-Request-ID', correlationId);

      request.log = request.log.child({
        correlationId,
      });

      // ✅ Log con mensaje descriptivo
      const methodEmoji = getMethodEmoji(request.method);
      const logMessage = `${methodEmoji} ${request.method} ${request.url}`;

      const logData: Record<string, any> = {
        ip: request.ip || (request.headers['x-forwarded-for'] as string),
        userAgent: request.headers['user-agent'],
      };

      // ✅ Solo agregar contentType si existe
      if (request.headers['content-type']) {
        logData.contentType = request.headers['content-type'];
      }

      // ✅ Solo agregar query si tiene parámetros
      if (Object.keys(request.query).length > 0) {
        logData.query = request.query;
      }

      request.log.info(logData, logMessage);
    }
  );

  // ✅ Pre-handler hook para loguear el body
  fastify.addHook(
    'preHandler',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // Solo para POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const bodyKeys = request.body
          ? Object.keys(request.body as Record<string, any>)
          : [];

        if (bodyKeys.length > 0) {
          request.log.info(
            {
              fields: bodyKeys,
            },
            `📋 Request body with ${bodyKeys.length} fields`
          );
        }
      }
    }
  );

  // Response hook
  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const responseTime = Date.now() - request.startTime;
      const statusEmoji = getStatusEmoji(reply.statusCode);

      request.log.info(
        {
          statusCode: reply.statusCode,
          responseTime: `${responseTime.toFixed(2)}ms`,
        },
        `${statusEmoji}  Response ${reply.statusCode} in ${responseTime.toFixed(
          2
        )}ms`
      );
    }
  );

  // Error hook
  fastify.addHook(
    'onError',
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      error: Error
    ): Promise<void> => {
      const statusCode = (error as any).statusCode || 500;
      const errorEmoji = getErrorEmoji(statusCode);

      const stackTrace = formatStackTrace(error.stack);

      request.log.error(
        {
          statusCode: statusCode,
          message: error.message,
          stack: stackTrace.length > 0 ? stackTrace : undefined,
        },
        `${errorEmoji} ${error.name}: ${error.message}`
      );
    }
  );
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
  fastify: '5.x',
});
