import { JWT_SECRET } from '../configs/envConfig.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { logger } from '../configs/loggerConfig.js';
import Cookies from 'cookies';

const authRequired = async (req, res, next) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');

  if (!token) {
    return res.status(401).json({ error: ['No autorizado'] });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    logger.child({ error }).error('Error en authRequired');
    return res.status(401).json({ error: ['Token inválido'] });
  }
};

export { authRequired };
