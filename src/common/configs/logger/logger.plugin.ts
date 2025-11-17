import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  export interface FastifyRequest {
    correlationId: string;
    startTime: number;
    hasError?: boolean;
    bodyInfo?: {
      count: number;
      fields: string;
    };
  }
}

export interface LoggerOptions {
  level?: string;
}

// ✅ Línea decorativa
const DIVIDER =
  '══════════════════════════════════════════════════════════════════════════════';

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

  // ✅ Hook 1: Guardar datos de la petición
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const correlationId =
        (request.headers['x-request-id'] as string) || randomUUID();
      const startTime = Date.now();

      request.correlationId = correlationId;
      request.startTime = startTime;
      request.hasError = false;
      reply.header('X-Request-ID', correlationId);

      // ✅ NO loguear aquí, solo guardar datos
    }
  );

  // ✅ Hook 2: Procesar body
  fastify.addHook(
    'preHandler',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const bodyKeys = request.body
          ? Object.keys(request.body as Record<string, any>)
          : [];

        if (bodyKeys.length > 0) {
          // ✅ Guardar info del body para usar después
          request.bodyInfo = {
            count: bodyKeys.length,
            fields: bodyKeys.join(', '),
          };
        }
      }
    }
  );

  // ✅ Hook 3: Loguear respuesta exitosa
  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // ✅ Solo ejecutar si NO hay error
      if (!request.hasError) {
        const methodEmoji = getMethodEmoji(request.method);
        const responseTime = Date.now() - request.startTime;
        const statusEmoji = getStatusEmoji(reply.statusCode);

        fastify.log.info(DIVIDER);
        fastify.log.info(
          `${methodEmoji} ${request.method.toUpperCase()} ${request.url}`
        );

        if (isDevelopment) {
          const userAgent = request.headers['user-agent'];
          fastify.log.debug(
            `🗣️  IP: ${request.ip} | Agent: ${userAgent} | ID: ${request.correlationId}`
          );
        }

        if (request.bodyInfo) {
          fastify.log.info(
            `  📋 Body: ${request.bodyInfo.count} fields (${request.bodyInfo.fields})`
          );
        }

        fastify.log.info(
          `  ${statusEmoji} ${reply.statusCode} | ${responseTime.toFixed(2)}ms`
        );
        fastify.log.info(DIVIDER);
      }
    }
  );

  // ✅ Hook 4: Loguear errores
  fastify.addHook(
    'onError',
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      error: Error
    ): Promise<void> => {
      request.hasError = true;

      const err = error as any;
      const statusCode = err.statusCode || 500;
      const errorEmoji = getErrorEmoji(statusCode);
      const stackTrace = formatStackTrace(error.stack);
      const methodEmoji = getMethodEmoji(request.method);

      // ✅ Mostrar TODO dentro de las barras SOLO UNA VEZ
      fastify.log.info(DIVIDER);
      fastify.log.info(
        `${methodEmoji} ${request.method.toUpperCase()} ${request.url}`
      );

      if (isDevelopment) {
        const userAgent = request.headers['user-agent'];
        fastify.log.debug(
          `🗣️  IP: ${request.ip} | Agent: ${userAgent} | ID: ${request.correlationId}`
        );
      }

      if (request.bodyInfo) {
        fastify.log.info(
          `  📋 Body: ${request.bodyInfo.count} fields (${request.bodyInfo.fields})`
        );
      }

      // ✅ Detalles del error
      fastify.log.error(`  ${errorEmoji} ${error.name}: ${error.message}`);
      fastify.log.error(`    statusCode: ${statusCode}`);
      fastify.log.error(`    errorName: "${error.name}"`);
      fastify.log.error(`    message: "${error.message}"`);

      // ✅ Errores de validación
      if (err.validation && Array.isArray(err.validation)) {
        fastify.log.error(`    validation: [`);
        err.validation.forEach((v: any) => {
          fastify.log.error(`      {`);
          let field = v.field;
          if (!field || field === 'undefined') {
            field = v.instancePath
              ? v.instancePath.replace(/^\//, '').split('/')[0]
              : 'unknown';
          }
          fastify.log.error(`        field: "${field}",`);
          fastify.log.error(`        message: "${v.message}"`);
          fastify.log.error(`      },`);
        });
        fastify.log.error(`    ]`);
      }

      // ✅ Stack trace
      if (stackTrace.length > 0) {
        fastify.log.error(`    stack: [`);
        stackTrace.forEach((line) => {
          fastify.log.error(`      "${line}",`);
        });
        fastify.log.error(`    ]`);
      }

      fastify.log.info(DIVIDER);
    }
  );
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
  fastify: '5.x',
});
