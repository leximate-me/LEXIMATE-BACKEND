import { DataSource } from 'typeorm';
import { EnvConfiguration } from '../common/configs/env.config';
import { logger } from '../common/configs/logger.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: EnvConfiguration().dbHost,
  port: EnvConfiguration().dbPort,
  username: EnvConfiguration().dbUser,
  password: EnvConfiguration().dbPassword,
  database: EnvConfiguration().dbName,
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
