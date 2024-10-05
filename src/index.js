import './database/sync.js';
import figlet from 'figlet';
import { app } from './app.js';
import { PORT } from './configs/envConfig.js';
import { logger } from './configs/loggerConfig.js';

// Generar texto ASCII con figlet
figlet('LEXIMATE', { font: 'Ghost' }, (err, data) => {
  if (err) {
    logger.error('Error generando texto ASCII:', err);
    return;
  }

  // Imprimir el texto ASCII usando logger
  logger.info('\n' + data);

  // Ponemos a escuchar el servidor en el puerto que hemos definido en el archivo de configuración.
  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en el puerto: ${PORT}`);
  });
});
