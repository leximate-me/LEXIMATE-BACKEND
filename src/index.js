import { app } from './app.js';
import { PORT } from './configs/envConfig.js';
import { connectDB } from './database/db.js';

app.listen(PORT, async () => {
  console.log(`👣 Servidor corriendo en el puerto: ${PORT} 👣`);
  await connectDB();
});
