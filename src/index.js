import { app } from './app.js';
import { PORT } from './configs/envConfig.js';
import './database/sync.js';

// Ponemos a escuchar el servidor en el puerto que hemos definido en el archivo de configuración.
app.listen(PORT, () => {
  console.log(`👣 Servidor corriendo en el puerto: ${PORT} 👣`);
});
