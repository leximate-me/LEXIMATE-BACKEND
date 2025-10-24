import { PORT } from './common/configs/env.config';
import { App } from './app';
import { connectDB } from './database/db';

async function main() {
  // Creamos una nueva instancia de la clase App y le pasamos el puerto
  const app = new App(PORT);

  // Conectamos a la base de datos
  await connectDB();

  // Ponemos en escucha al servidor
  app.listen();
}

main(); // Inicializamos la aplicación
