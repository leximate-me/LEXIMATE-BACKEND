import { app } from './app.js';
import { PORT } from './configs/envConfig.js';
import './database/sync.js';
import { logger } from './configs/loggerConfig.js';

// Ponemos a escuchar el servidor en el puerto que hemos definido en el archivo de configuración.
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto: ${PORT}`);
});
