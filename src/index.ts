import './database/sync';
import figlet from 'figlet';
import { app } from './app';
import { PORT } from './configs/env.config';
import { logger } from './configs/logger.config';
import { connectDB } from './database/db';
import { syncModels } from './database/sync';

// Generar texto ASCII con figlet
figlet('LEXIMATE', { font: 'Ghost' }, async (err, data) => {
  if (err) {
    logger.error('Error generando texto ASCII:', err);
    return;
  }
  // Imprimir el texto ASCII usando logger
  logger.info('\n' + data);

  // Conectamos a la base de datos y sincronizamos los modelos
  await connectDB();
  await syncModels();

  // Ponemos a escuchar el servidor en el puerto que hemos definido en el archivo de configuración.
  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en el puerto: ${PORT}`);
  });
});
