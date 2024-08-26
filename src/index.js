import { app } from './app.js';
import { PORT } from './configs/envConfig.js';
import { connectDB } from './database/db.js';

app.listen(PORT, () => {
  connectDB();
  console.log(`👣 Servidor corriendo en el puerto: ${PORT} 👣`);
});
