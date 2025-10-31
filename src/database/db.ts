import { DataSource } from 'typeorm';
import { FastifyBaseLogger } from 'fastify';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
