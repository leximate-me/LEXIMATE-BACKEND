import { App } from './app';
import { connectDB } from './database/db';
import 'dotenv/config';
import figlet from 'figlet';

async function main() {
  const app = new App();
  const log = app.getLogger();

  figlet.text(
    'LEXIMATE',
    { font: 'Ghost' },
    (err: Error | null, data: string | undefined) => {
      if (err) {
        log.error(err, 'Error generando texto ASCII');
        return;
      }
      log.info('\n' + data);
    }
  );
  try {
    await app.prepare();

    await connectDB(log);

    await app.listen();
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
}

main();
