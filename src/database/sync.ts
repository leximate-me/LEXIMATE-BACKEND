import { logger } from '../configs/logger.config';
import './relationship';
import { sequelize } from './db';

async function syncModels() {
  try {
    //await sequelize.sync({ force: true });

    await sequelize.sync({ alter: true });

    logger.info('Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('Error al sincronizar los modelos:', error);
  }
}

export { syncModels };
