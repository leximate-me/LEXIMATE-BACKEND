import { PORT } from './common/configs/env.config';
import { App } from './app';
import { connectDB } from './database/db';

async function main() {
  const app = new App(PORT);

  await connectDB();

  app.listen();
}

main();
