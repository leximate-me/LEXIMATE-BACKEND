import mongoose from 'mongoose';
import { MONGODB_URI } from '../configs/env.config.js';

const connectDB = async () => {
  try {
    const connnect = await mongoose.connect(MONGODB_URI);
    console.log(
      `💻 Conexión exitosa a la base de datos: ${connnect.connection.name} 💻`
    );
    return connnect;
  } catch (error) {
    console.error('Error en la conexión a Mongo:', error.message);
    process.exit(1);
  }
};

export { connectDB };
