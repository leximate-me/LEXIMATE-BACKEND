import express, { Application } from 'express';
import { applyMiddlewares } from './common/middlewares/app.middleware';
import { authRouter } from './modules/auth/routes/auth.route';
import { classRouter } from './modules/course/course.route';
import { toolRouter } from './modules/tool/tool.route';
import { postRouter } from './modules/post/post.route';
import { logger } from './common/configs/logger.config';
import 'reflect-metadata';
import figlet from 'figlet';

export class App {
  private app: Application = express();

  constructor(private port: string) {
    this.applyMiddlewares();
    this.setRoutes();
    this.settings();
  }

  private applyMiddlewares() {
    applyMiddlewares(this.app);
  }

  private setRoutes() {
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/class', classRouter);
    this.app.use('/api/tool', toolRouter);
    this.app.use('/api/post', postRouter);
  }

  private settings() {
    this.app.set('port', this.port || process.env.PORT);
  }

  public listen() {
    this.app.listen(this.app.get('port'));
    figlet.text(
      'LEXIMATE',
      { font: 'Ghost' },
      (err: Error | null, data: string | undefined) => {
        if (err) {
          logger.error(err, 'Error generando texto ASCII');
          return;
        }

        logger.info('\n' + data);

        logger.info(`Servidor corriendo en el puerto: ${this.port}`);
      }
    );
  }
}
