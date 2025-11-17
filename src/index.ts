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
║         🚀 LEXIMATE BACKEND        ║
║       Esto va ser epico papus      ║
╚════════════════════════════════════╝
`;

async function main() {
  try {
    console.log(BANNER);

    const app = new App();

    await app.prepareConfig();
    const logger = app.getLogger();

    await AppDataSource.initialize(logger);

    await app.setupRoutes();

    await app.listen();
  } catch (error) {
    console.error('💥 Unhandled error in main:', error);
    process.exit(1);
  }
}

main();
