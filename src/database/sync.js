import { connectDB } from './db.js';
import './relationship.js';

const syncModels = async () => {
  try {
    const sequelize = await connectDB();
    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.log('Error al sincronizar los modelos:', error);
  }
};

syncModels();
