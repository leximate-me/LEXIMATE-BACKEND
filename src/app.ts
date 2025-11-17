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
    // ✅ Health check
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

    // ✅ Test logger
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

    // ✅ Registrar routers (DB ya está inicializada)
    await this.instance.register(authRouter, { prefix: '/api/auth' });
    await this.instance.register(courseRouter, { prefix: '/api/course' });
    await this.instance.register(toolRouter, { prefix: '/api/tool' });
    await this.instance.register(postRouter, { prefix: '/api/post' });
    await this.instance.register(seedRouter, { prefix: '/api/seed' });
  }

  private setErrorHandler() {
    this.instance.setSchemaErrorFormatter((errors) => {
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

  // ✅ Preparar ANTES de inicializar DB
  public async prepareConfig() {
    // 1️⃣ Logger plugin
    await this.instance.register(loggerPlugin);

    // 2️⃣ Environment variables
    await this.instance.register(fastifyEnv, {
      confKey: 'config',
      schema: envSchema,
      dotenv: false,
    });

    // 3️⃣ Actualizar nivel de log
    const config = this.instance.config;
    if (config.LOG_LEVEL) {
      this.instance.log.level = config.LOG_LEVEL.toLowerCase();
    }

    // 4️⃣ Middlewares
    await this.applyMiddlewares();

    // 5️⃣ Error handlers
    this.setErrorHandler();

    // ✅ NO llamar a ready() aquí
  }

  // ✅ Setup rutas DESPUÉS de DB (antes de listen)
  public async setupRoutes() {
    const config = this.instance.config;

    // Log de configuración
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

    // Registrar rutas
    await this.setRoutes();

    // ✅ Llamar a ready() AQUÍ después de agregar rutas
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
