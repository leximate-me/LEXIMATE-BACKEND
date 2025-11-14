import { App } from './app';
import { AppDataSource } from './database/db';
import 'dotenv/config';
import figlet from 'figlet';

async function main() {
  const app = new App();

  figlet.text('LEXIMATE', { font: 'Ghost' }, (err: Error, data: string) => {
    if (err) {
      app.getLogger().error(err, 'Error generating ASCII art');
      return;
    }
    app.getLogger().info('\n' + data);
  });

  await AppDataSource.initialize(app.getLogger());

  await app.prepare();

  await app.listen();
}

main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
