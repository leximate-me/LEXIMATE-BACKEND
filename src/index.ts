import { EnvConfiguration } from './common/configs/env.config';
import { App } from './app';
import { connectDB } from './database/db';

import { logger } from './common/configs/logger.config';
import figlet from 'figlet';

async function main() {
  const app = new App(EnvConfiguration().port);
  figlet.text(
    'LEXIMATE',
    { font: 'Ghost' },
    (err: Error | null, data: string | undefined) => {
      if (err) {
        logger.error(err, 'Error generando texto ASCII');
        return;
      }

      logger.info('\n' + data);
    }
  );
  await connectDB();
  await app.listen();
}

main();
