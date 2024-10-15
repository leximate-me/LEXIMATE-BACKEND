import { Sequelize } from 'sequelize';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
} from '../configs/envConfig.js';
import { logger } from '../configs/loggerConfig.js';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Puedes ajustar esto según tus necesidades de seguridad
    },
  },
});

const connectDB = async () => {
  try {
    // Autenticar la conexión con Sequelize
    await sequelize.authenticate();
    logger.info('Conexion establecida correctamente con la base de datos.');
    return sequelize;
  } catch (error) {
    logger.child({ error }).fatal('Error al conectar con la base de datos.');
    throw error;
  }
};

export { connectDB, sequelize };
