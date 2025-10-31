import Fastify, { FastifyInstance } from 'fastify';
import 'reflect-metadata';
import { applyMiddlewares } from './common/middlewares/app.middleware';
import { authRouter } from './modules/auth/routes/auth.route';
import { courseRouter } from './modules/course/routes/course.route';
import { toolRouter } from './modules/tool/routes/tool.route';
import { postRouter } from './modules/post/routes/post.route';

import { seedRouter } from './modules/seed/routes/seed.route';
import { logger } from './common/configs/logger.config';

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

    await this.app.listen({ port: this.port, host: '0.0.0.0' });
  }
}
