import { JWT_SECRET } from '../configs/envConfig.js';
import { logger } from '../configs/loggerConfig.js';
import jwt from 'jsonwebtoken';

interface PayloadData {
  [key: string]: any;
}

const createAccessToken = (payload: PayloadData) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) {
        logger.child({ error: err }).error('Error al crear el token');
        reject(err);
      }
      resolve(token);
    });
  });
};

export { createAccessToken };
