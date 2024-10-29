import { JWT_SECRET } from '../configs/envConfig.js';
import { logger } from '../configs/loggerConfig.js';
import jwt from 'jsonwebtoken';

interface PayloadData {
  [key: string]: any;
}

const createAccessToken = async (payload: PayloadData): Promise<string> => {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          logger.error(err, 'Error en createAccessToken');
          reject(err);
        }
        resolve(token as string);
      });
    });
    return token;
  } catch (error) {
    throw new Error('Error al crear el token');
  }
};

export { createAccessToken };
