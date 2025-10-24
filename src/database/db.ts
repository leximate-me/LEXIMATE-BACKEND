import { DataSource } from 'typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
} from '../common/configs/env.config';
import { logger } from '../common/configs/logger.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: 5442,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],
  synchronize: true, // Solo para desarrollo
  logging: false,
  poolSize: 5,
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Conexión establecida correctamente con la base de datos.');
    return AppDataSource;
  } catch (error) {
    logger.error(`Error al conectar con la base de datos: ${String(error)}`);
    return null;
  }
};
