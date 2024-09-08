import { app } from './app.js';
import { PORT } from './configs/env.config.js';
import { connectDB } from './database/db.js';

// Ponemos a escuchar el servidor en el puerto que hemos definido en el archivo de configuración.
app.listen(PORT, () => {
  connectDB();
  console.log(`👣 Servidor corriendo en el puerto: ${PORT} 👣`);
});
