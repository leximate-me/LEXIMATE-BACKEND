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

export class App {
  private app: FastifyInstance;

  constructor(private port: number) {
    this.app = Fastify({ logger });
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

  public getLogger() {
    return this.app.log;
  }

  public async listen() {
    await this.applyMiddlewares();
    await this.setRoutes();

    this.app.setErrorHandler((error, request, reply) => {
      function getErrorText(statusCode: number) {
        switch (statusCode) {
          case 400:
            return 'Bad Request';
          case 401:
            return 'Unauthorized';
          case 402:
            return 'Payment Required';
          case 403:
            return 'Forbidden';
          case 404:
            return 'Not Found';
          case 405:
            return 'Method Not Allowed';
          case 409:
            return 'Conflict';
          case 415:
            return 'Unsupported Media Type';
          case 422:
            return 'Unprocessable Entity';
          case 429:
            return 'Too Many Requests';
          case 500:
            return 'Internal Server Error';
          case 501:
            return 'Not Implemented';
          case 503:
            return 'Service Unavailable';
          default:
            return 'Error';
        }
      }

      if (error instanceof HttpError) {
        reply.code(error.statusCode).type('application/json').send({
          statusCode: error.statusCode,
          error: error.getErrorText(),
          message: error.publicMessage, // SIEMPRE usa publicMessage, sea string u objeto
        });
      } else {
        const status = error.statusCode || 500;
        reply
          .code(status)
          .type('application/json')
          .send({
            statusCode: status,
            error: getErrorText(status),
            message: error.message || 'Internal Server Error',
          });
      }
      // console.log(error);
    });
    await this.app.listen({ port: this.port, host: '0.0.0.0' });
  }
}
