import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../database/db';
import { logger } from '../configs/logger.config';
import { User } from '../../modules/user/entities/user.entity';
import { HttpError } from '../libs/http-error';

const verifyUserRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.user?.id;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (user?.verified !== true) {
      logger.error('Usuario no verificado');
      throw new HttpError(403, 'Usuario no verificado');
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export { verifyUserRequired };
