import { JWT_SECRET } from '../configs/envConfig.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const authRequired = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: ['No autorizado'] });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: ['Token inválido'] });
  }
};

export { authRequired };
