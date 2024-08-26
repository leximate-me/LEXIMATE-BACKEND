import { JWT_SECRET } from '../configs/envConfig.js';
import jwt from 'jsonwebtoken';

const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export { createAccessToken };
