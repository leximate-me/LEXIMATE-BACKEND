import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../configs/env.config';
import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { HttpError } from '../libs/http-error';

const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      throw new HttpError(401, 'Token no proporcionado');
    }

    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    if (!decoded) {
      throw new HttpError(401, 'Token inválido');
    }
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export { authRequired };
