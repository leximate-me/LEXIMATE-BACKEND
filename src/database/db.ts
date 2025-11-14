import { DataSource, Repository } from 'typeorm';
import { FastifyBaseLogger } from 'fastify';

export class AppDataSourceManager {
  private static dataSource: DataSource;
  private static logger: FastifyBaseLogger;

  static async initialize(log: FastifyBaseLogger): Promise<DataSource> {
    if (!AppDataSourceManager.dataSource) {
      AppDataSourceManager.logger = log;
      AppDataSourceManager.dataSource = new DataSource({
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
      try {
        await AppDataSourceManager.dataSource.initialize();
        log.info('Database connection established successfully.');
      } catch (error) {
        log.error(`Error connecting to the database: ${String(error)}`);
        throw error;
      }
    }
    return AppDataSourceManager.dataSource;
  }

  static getDataSource(): DataSource {
    if (!AppDataSourceManager.dataSource) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return AppDataSourceManager.dataSource;
  }

  static getRepository<T>(entity: new () => T): Repository<T> {
    return AppDataSourceManager.getDataSource().getRepository(entity);
  }
}

export { AppDataSourceManager as AppDataSource };
