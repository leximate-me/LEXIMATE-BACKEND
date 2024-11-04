import express, { Application } from 'express';
import { applyMiddlewares } from './middlewares/app.middleware';
import { userAuthRouter } from './routes/userAuth.route';
import { userClassRouter } from './routes/userClass.route';
import { userToolsRouter } from './routes/userTools.route';
import { userPostRouter } from './routes/userPost.route';
import { logger } from './configs/logger.config';
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
    this.app.use('/api/auth', userAuthRouter);
    this.app.use('/api/class', userClassRouter);
    this.app.use('/api/tool', userToolsRouter);
    this.app.use('/api/post', userPostRouter);
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
    figlet('LEXIMATE', { font: 'Ghost' }, async (err, data) => {
      if (err) {
        logger.error(err, 'Error generando texto ASCII');
      }

      // Imprimimos por consola el logo de 'LEXIMATE' creado como un texto ASCII
      logger.info('\n' + data);

      logger.info(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}
