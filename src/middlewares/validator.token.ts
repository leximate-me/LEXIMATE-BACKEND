import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/envConfig.js';
import { logger } from '../configs/loggerConfig.js';
import { Request, Response, NextFunction } from 'express';

export interface TokenPayload {
  id: number;
  rol: number;
  verify: boolean;
}

const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: ['No autorizado'] });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded.id || !decoded.rol || !decoded.verify) {
      res.status(401).json({ error: ['Token inválido'] });
      return;
    }
    req.user = decoded;

    next();
  } catch (error) {
    logger.child({ error }).error('Error en authRequired');
    res.status(401).json({ error: ['Token inválido'] });
  }
};

export { authRequired };