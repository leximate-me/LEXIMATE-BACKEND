import Fastify, {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyEnv from '@fastify/env';
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
    // Health check endpoint
    this.instance.get(
      '/',
      async (
        request: FastifyRequest,
        _reply: FastifyReply
      ): Promise<{
        message: string;
        status: string;
        timestamp: string;
        correlationId: string;
      }> => {
        request.log.info('🏥 Health check requested');
        return {
          message: 'Backend API',
          status: 'running',
          timestamp: new Date().toISOString(),
          correlationId: request.correlationId,
        };
      }
    );

    // Test logger endpoint
    this.instance.get(
      '/test-logger',
      async (
        request: FastifyRequest,
        _reply: FastifyReply
      ): Promise<{
        message: string;
        correlationId: string;
        logLevels: string[];
        timestamp: string;
      }> => {
        const log = request.log;
        log.info('📝 Testing logger functionality');
        log.debug('🐛 Debug message with additional context');
        log.warn('⚠️ Warning message example');
        return {
          message: 'Logger test completed successfully',
          correlationId: request.correlationId,
          logLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
          timestamp: new Date().toISOString(),
        };
      }
    );
    await this.instance.register(authRouter, { prefix: '/api/auth' });
    await this.instance.register(courseRouter, { prefix: '/api/course' });
    await this.instance.register(toolRouter, { prefix: '/api/tool' });
    await this.instance.register(postRouter, { prefix: '/api/post' });
    await this.instance.register(seedRouter, { prefix: '/api/seed' });
  }

  private serErrorHandler() {
    this.instance.setSchemaErrorFormatter((errors, dataVar) => {
      const err = new Error('Validation error') as FastifyError;
      err.statusCode = 400;
      (err as any).error = 'Bad Request';
      (err as any).validation = errors.map((e) => ({
        field: e.instancePath
          ? e.instancePath.replace(/^\//, '')
          : e.params.missingProperty,
        message: e.message,
      }));
      return err;
    });

    this.instance.setErrorHandler((error, request, reply) => {
      const err = error as any;

      if (err.validation) {
        reply.send(error);
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

  public async prepare() {
    await this.instance.register(loggerPlugin);
    await this.instance.register(fastifyEnv, {
      confKey: 'config',
      schema: envSchema,
      dotenv: false,
      data: process.env,
    });

    await this.applyMiddlewares();

    await this.setRoutes();

    this.serErrorHandler();

    await this.instance.ready();
  }

  public async listen() {
    await this.instance.listen({
      port: Number(this.instance.config.PORT),
      host: '0.0.0.0',
      listenTextResolver(address) {
        return `🚀 Server is running at ${address}`;
      },
    });
  }
}
