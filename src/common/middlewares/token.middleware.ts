import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../configs/env.config';
import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      res.status(401).json({ error: ['No autorizado'] });
      return;
    }

    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    if (!decoded) {
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
