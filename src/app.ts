import Fastify, { FastifyInstance } from 'fastify';
import 'reflect-metadata';
import { applyMiddlewares } from './common/middlewares/app.middleware';
import { authRouter } from './modules/auth/routes/auth.route';
import { courseRouter } from './modules/course/routes/course.route';
import { toolRouter } from './modules/tool/routes/tool.route';
import { postRouter } from './modules/post/routes/post.route';

import { seedRouter } from './modules/seed/routes/seed.route';
import { logger } from './common/configs/logger.config';
import { HttpError } from './common/libs/http-error';
import avjErrors from 'ajv-errors';
import fastifyEnv from '@fastify/env';
import { envSchema } from './common/configs/env-schema.config';

export class App {
  private app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      logger: logger,
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
    await applyMiddlewares(this.app);
  }

  private async setRoutes() {
    await this.app.register(authRouter, { prefix: '/api/auth' });
    await this.app.register(courseRouter, { prefix: '/api/course' });
    await this.app.register(toolRouter, { prefix: '/api/tool' });
    await this.app.register(postRouter, { prefix: '/api/post' });
    await this.app.register(seedRouter, { prefix: '/api/seed' });
  }

  private serErrorHandler() {
    this.app.setSchemaErrorFormatter((errors, dataVar) => {
      const err = new Error('Error de validación');
      (err as any).statusCode = 400;
      (err as any).error = 'Bad Request';
      (err as any).validation = errors.map((e) => ({
        field: e.instancePath
          ? e.instancePath.replace(/^\//, '')
          : e.params.missingProperty,
        message: e.message,
      }));
      return err;
    });

    this.app.setErrorHandler((error, request, reply) => {
      if ((error as any).validation) {
        reply.send(error);
        return;
      }

      // Errores de negocio personalizados
      if (error instanceof HttpError) {
        reply.code(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.getErrorText(),
          message: error.publicMessage,
        });
        return;
      }

      // Otros errores
      const status = error.statusCode || 500;
      reply.code(status).send({
        statusCode: status,
        error: 'Internal Server Error',
        message: error.message || 'Error interno del servidor',
      });
    });
  }

  public getFastify() {
    return this.app;
  }

  public getLogger() {
    return this.app.log;
  }

  public async prepare() {
    await this.app.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
    });
    await this.applyMiddlewares();
    await this.setRoutes();
    this.serErrorHandler();
  }

  public async listen() {
    await this.app.listen({
      port: Number(this.app.config.PORT),
      host: '0.0.0.0',
    });
  }
}
