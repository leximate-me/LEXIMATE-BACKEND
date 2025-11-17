import Fastify, {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyRedis from '@fastify/redis';
import avjErrors from 'ajv-errors';
import 'reflect-metadata';

import { applyMiddlewares } from '@common/middlewares/app.middleware';
import { HttpError } from '@common/libs/http-error';
import { envSchema } from '@common/configs/env-schema.config';

import { authRouter } from '@modules/auth/routes/auth.route';
import { courseRouter } from '@modules/course/routes/course.route';
import { toolRouter } from '@modules/tool/routes/tool.route';
import { postRouter } from '@modules/post/routes/post.route';
import { seedRouter } from '@modules/seed/routes/seed.route';
import { logger } from '@common/configs/logger/logger.config';
import loggerPlugin from '@common/configs/logger/logger.plugin';
import { NotificationService } from '@common/services/notification.service';
import { setupWebSocket } from '@common/configs/websocket.plugin';

export class App {
  private instance: FastifyInstance;

  constructor() {
    this.instance = Fastify({
      logger: logger,
      disableRequestLogging: true,
      ajv: {
        customOptions: {
          allErrors: true,
          coerceTypes: true,
        },
        plugins: [avjErrors],
      },
    });
  }

  private async applyMiddlewares() {
    await applyMiddlewares(this.instance);
  }

  private async setRoutes() {
    this.instance.get(
      '/',
      async (request: FastifyRequest, _reply: FastifyReply) => {
        request.log.info('🏥 Health check requested');
        return {
          message: 'Backend API',
          status: 'running',
          timestamp: new Date().toISOString(),
          correlationId: request.correlationId,
        };
      }
    );

    this.instance.get(
      '/test-logger',
      async (request: FastifyRequest, _reply: FastifyReply) => {
        request.log.info('📝 Testing logger functionality');
        request.log.debug('🐛 Debug message');
        request.log.warn('⚠️  Warning message');
        return {
          message: 'Logger test completed successfully',
          correlationId: request.correlationId,
        };
      }
    );

    await this.instance.register(authRouter, { prefix: '/api/auth' });
    await this.instance.register(courseRouter, { prefix: '/api/course' });
    await this.instance.register(toolRouter, { prefix: '/api/tool' });
    await this.instance.register(postRouter, { prefix: '/api/post' });
    await this.instance.register(seedRouter, { prefix: '/api/seed' });
  }

  private setErrorHandler() {
    this.instance.setSchemaErrorFormatter((errors, dataType) => {
      const err = new Error('Validation error') as FastifyError;
      err.statusCode = 400;
      (err as any).error = 'Bad Request';

      (err as any).validation = errors.map((e) => {
        let field: string = 'unknown';

        if (e.instancePath && e.instancePath !== '/') {
          const pathParts = e.instancePath.split('/').filter(Boolean);
          field = pathParts[0] || 'unknown';
        }

        return {
          field,
          message: e.message,
        };
      });

      return err;
    });

    this.instance.setErrorHandler((error, request, reply) => {
      const err = error as any;

      if (err.validation && Array.isArray(err.validation)) {
        const isTransformed = err.validation[0]?.field !== undefined;

        reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation error',
          validation: isTransformed
            ? err.validation
            : err.validation.map((e: any) => ({
                field:
                  e.instancePath?.replace(/^\//, '').split('/')[0] || 'unknown',
                message: e.message,
              })),
        });
        return;
      }

      if (error instanceof HttpError) {
        reply.code(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.getErrorText(),
          message: error.publicMessage,
        });
        return;
      }

      const status = err.statusCode || 500;
      reply.code(status).send({
        statusCode: status,
        error: 'Internal Server Error',
        message: err.message || 'unknown error',
      });
    });
  }

  public getFastify() {
    return this.instance;
  }

  public getLogger() {
    return this.instance.log;
  }

  public async prepareConfig() {
    await this.instance.register(loggerPlugin);

    await this.instance.register(fastifyEnv, {
      confKey: 'config',
      schema: envSchema,
      dotenv: false,
    });

    await this.instance.register(fastifyRedis, {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      closeClient: true, // <-- Cierra la conexión al apagar Fastify
    });

    const config = this.instance.config;
    if (config.LOG_LEVEL) {
      this.instance.log.level = config.LOG_LEVEL.toLowerCase();
    }

    await this.applyMiddlewares();

    this.setErrorHandler();
  }

  public async setupRoutes() {
    const config = this.instance.config;

    this.instance.log.info(
      {
        environment: config.NODE_ENV,
        port: config.PORT,
        host: config.HOST,
        database: config.DB_NAME,
        logLevel: config.LOG_LEVEL,
      },
      '⚙️  Application configured'
    );

    try {
      const notificationService = NotificationService.getInstance(
        this.instance.redis
      );
      console.log('✅ NotificationService inicializado correctamente');

      // Configura WebSocket
      await setupWebSocket(this.instance, notificationService);
    } catch (error) {
      console.error('❌ Error inicializando NotificationService:', error);
      throw error;
    }

    await this.setRoutes();

    await this.instance.ready();
  }

  public async listen() {
    const abortController = new AbortController();

    process.on('SIGTERM', () => {
      this.instance.log.info('🛑 SIGTERM received, closing gracefully...');
      abortController.abort();
    });

    process.on('SIGINT', () => {
      this.instance.log.info('🛑 SIGINT received, closing gracefully...');
      abortController.abort();
    });

    const { PORT, HOST } = this.instance.config;

    await this.instance.listen({
      port: PORT,
      host: HOST,
      signal: abortController.signal,
      listenTextResolver(address) {
        return `🚀 Server listening at ${address}`;
      },
    });
  }
}
