import express, { Application } from 'express';
import { applyMiddlewares } from './common/middlewares/app.middleware';
import { authRouter } from './modules/auth/routes/auth.route';
import { courseRouter } from './modules/course/routes/course.route';
import { toolRouter } from './modules/tool/routes/tool.route';
import { postRouter } from './modules/post/routes/post.route';
import { logger } from './common/configs/logger.config';
import 'reflect-metadata';
import { seedRouter } from './modules/seed/routes/seed.route';
import { errorHandler } from './common/middlewares/error.middleware';

export class App {
  private app: Application = express();

  constructor(private port: number) {
    this.settings();
    this.applyMiddlewares();
    this.setRoutes();
    this.applyErrorHandler();
  }

  private applyMiddlewares() {
    applyMiddlewares(this.app);
  }

  private setRoutes() {
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/course', courseRouter);
    this.app.use('/api/tool', toolRouter);
    this.app.use('/api/post', postRouter);
    this.app.use('/api/seed', seedRouter);
  }

  private applyErrorHandler() {
    this.app.use(errorHandler);
  }

  private settings() {
    this.app.set('port', this.port);
  }

  public async listen() {
    this.app.listen(this.app.get('port'));

    logger.info(`Servidor corriendo en el puerto: ${this.port}`);
  }
}
