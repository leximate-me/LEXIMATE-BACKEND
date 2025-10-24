import express, { Application } from 'express';
import { applyMiddlewares } from './common/middlewares/app.middleware';
import { authRouter } from './modules/auth/routes/auth.route';
import { classRouter } from './modules/course/course.route';
import { toolRouter } from './modules/tool/tool.route';
import { postRouter } from './modules/post/post.route';
import { logger } from './common/configs/logger.config';
import 'reflect-metadata';
import figlet from 'figlet';

// Creamos una clase y la exportamos
export class App {
  private app: Application;

  private port: number | string;

  // Función para aplicar los middlewares de la aplicación
  private applyMiddlewares() {
    applyMiddlewares(this.app);
  }

  // Función para setear las rutas de la aplicación
  private setRoutes() {
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/class', classRouter);
    this.app.use('/api/tool', toolRouter);
    this.app.use('/api/post', postRouter);
  }

  // Constructor de la clase App
  constructor(port: number | string) {
    this.app = express();
    this.port = port;
    this.applyMiddlewares();
    this.setRoutes();
    this.settings();
  }

  // Configuración para setear el puerto del servidor obteniendo el parametro de la funcion
  private settings() {
    this.app.set('port', this.port || process.env.PORT);
  }

  // Función para poner en escucha al servidor
  listen() {
    this.app.listen(this.app.get('port'));
    figlet.text(
      'LEXIMATE',
      { font: 'Ghost' },
      (err: Error | null, data: string | undefined) => {
        if (err) {
          logger.error(err, 'Error generando texto ASCII');
          return;
        }

        // Imprimimos por consola el logo de 'LEXIMATE' creado como un texto ASCII
        logger.info('\n' + data);

        logger.info(`Servidor corriendo en el puerto: ${this.port}`);
      }
    );
  }
}
