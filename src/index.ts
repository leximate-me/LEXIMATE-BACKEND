import { config as dotenvConfig } from 'dotenv';
import { App } from './app';
import { AppDataSource } from './database/db';

if (process.env.NODE_ENV !== 'production') {
  dotenvConfig({
    path: '.env',
    debug: false,
  });
}

const BANNER = `
╔════════════════════════════════════╗
║         🚀 LEXIMATE BACKEND       ║
║      Backend API Server v1.0      ║
╚════════════════════════════════════╝
`;

async function main() {
  try {
    // 1️⃣ Mostrar banner
    console.log(BANNER);

    // 2️⃣ Crear app
    const app = new App();

    // 3️⃣ Preparar config (sin rutas)
    await app.prepareConfig();
    const logger = app.getLogger();

    // 4️⃣ Inicializar base de datos
    await AppDataSource.initialize(logger);
    logger.info('🔧 Database connection established successfully');

    // 5️⃣ Setup rutas (DESPUÉS de DB)
    await app.setupRoutes();

    // 6️⃣ Iniciar servidor
    await app.listen();
  } catch (error) {
    console.error('💥 Unhandled error in main:', error);
    process.exit(1);
  }
}

main();
