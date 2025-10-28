import { EnvConfiguration } from './common/configs/env.config';
import { App } from './app';
import { connectDB } from './database/db';
import { errorHandler } from './common/middlewares/error.middleware';

async function main() {
  const app = new App(EnvConfiguration().port);

  await connectDB();

  app.listen();
}

main();
