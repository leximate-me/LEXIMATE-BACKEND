import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
} from '../configs/envConfig.js';
import { logger } from '../configs/loggerConfig.js';

// Función para crear la base de datos si no existe
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    logger.info(`Base de datos "${DB_NAME}" verificada o creada.`);
    await connection.end();
  } catch (error) {
    logger
      .child({ error })
      .fatal('Error al verificar o crear la base de datos.');
    throw error;
  }
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    // Verifica si la base de datos existe o la crea
    await createDatabase();

    // Autenticar la conexión con Sequelize
    await sequelize.authenticate();
    logger.info('Conexion establecida correctamente con la base de datos.');
    return sequelize;
  } catch (error) {
    logger.child({ error }).fatal('Error al conectar con la base de datos.');
  }
};

export { connectDB, sequelize };
