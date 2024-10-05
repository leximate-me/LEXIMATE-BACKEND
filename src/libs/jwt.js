import { JWT_SECRET } from '../configs/envConfig.js';
import jwt from 'jsonwebtoken';
import { logger } from '../configs/loggerConfig.js';

const createAccessToken = (payload) => {
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
