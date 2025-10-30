import { DataSource } from 'typeorm';
import { EnvConfiguration } from '../common/configs/env.config';
import { FastifyBaseLogger } from 'fastify';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: EnvConfiguration().dbHost,
  port: EnvConfiguration().dbPort,
  username: EnvConfiguration().dbUser,
  password: EnvConfiguration().dbPassword,
  database: EnvConfiguration().dbName,
  entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],
  synchronize: true,
  logging: false,
  poolSize: 5,
});

export const connectDB = async (log: FastifyBaseLogger) => {
  try {
    await AppDataSource.initialize();
    log.info('Database connection established successfully.');

    return AppDataSource;
  } catch (error) {
    log.error(`Error connecting to the database: ${String(error)}`);
  }
};
