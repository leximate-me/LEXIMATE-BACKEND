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

// ✅ Línea decorativa
const DIVIDER = '═══════════════════════════════════════';

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

function getStatusEmoji(statusCode: number): string {
  if (statusCode < 300) return '✅';
  if (statusCode < 400) return '🔀';
  if (statusCode < 500) return '⚠️';
  return '❌';
}

function getErrorEmoji(statusCode: number): string {
  if (statusCode === 400) return '❌';
  if (statusCode === 401) return '🔐';
  if (statusCode === 403) return '🚫';
  if (statusCode === 404) return '🔍';
  if (statusCode === 409) return '⚔️';
  if (statusCode === 422) return '✔️';
  if (statusCode === 429) return '⏱️';
  if (statusCode >= 500) return '💥';
  return '⚠️';
}

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

  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const correlationId =
        (request.headers['x-request-id'] as string) || randomUUID();
      const startTime = Date.now();

      request.correlationId = correlationId;
      request.startTime = startTime;
      reply.header('X-Request-ID', correlationId);

      const methodEmoji = getMethodEmoji(request.method);

      // ✅ Mostrar barra ARRIBA SIN saltos de línea extra
      console.log(`\n${DIVIDER}`);
      // ✅ Mensaje principal
      console.log(
        `${methodEmoji} ${request.method.toUpperCase()} ${request.url}`
      );

      // ✅ Detalles si es desarrollo
      if (isDevelopment) {
        const userAgent = request.headers['user-agent'];
        console.log(
          `  IP: ${request.ip} | Agent: ${userAgent} | ID: ${correlationId}`
        );
      }
    }
  );

  fastify.addHook(
    'preHandler',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const bodyKeys = request.body
          ? Object.keys(request.body as Record<string, any>)
          : [];

        if (bodyKeys.length > 0) {
          console.log(
            `  📋 Body: ${bodyKeys.length} fields (${bodyKeys.join(', ')})`
          );
        }
      }
    }
  );

  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const responseTime = Date.now() - request.startTime;
      const statusEmoji = getStatusEmoji(reply.statusCode);

      console.log(
        `  ${statusEmoji} ${reply.statusCode} | ${responseTime.toFixed(2)}ms`
      );
      // ✅ Mostrar barra ABAJO
      console.log(`${DIVIDER}\n`);
    }
  );

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

      console.log(`\n${DIVIDER}`);
      fastify.log.error(
        {
          statusCode,
          errorName: error.name,
          message: error.message,
          stack: stackTrace.length > 0 ? stackTrace : undefined,
          correlationId: request.correlationId,
        },
        `${errorEmoji} ${error.name}: ${error.message}`
      );
      console.log(`${DIVIDER}\n`);
    }
  );
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
  fastify: '5.x',
});
