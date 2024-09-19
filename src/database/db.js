import { Sequelize } from 'sequelize';

// Crear una instancia de Sequelize sin especificar la base de datos inicialmente
const sequelize = new Sequelize('', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const createDatabase = async () => {
  try {
    // Conectar a MySQL sin especificar la base de datos
    await sequelize.query('CREATE DATABASE IF NOT EXISTS leximate');
  } catch (error) {
    console.log(error);
  }
};

const connectDB = async () => {
  try {
    await createDatabase();

    // Crear una nueva instancia de Sequelize especificando la base de datos
    const sequelizeWithDB = new Sequelize('leximate', 'root', '', {
      host: 'localhost',
      dialect: 'mysql',
    });

    // Probar la conexión
    await sequelizeWithDB.authenticate();
    console.log('Conectado a la base de datos: leximate');

    return sequelizeWithDB;
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
