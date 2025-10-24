import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../database/db';
import { logger } from '../configs/logger.config';
import { User } from '../../modules/auth/entities/user.entity';

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
      throw new Error('Usuario no verificado');
    }

    return next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en verifyUserRequired');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en verifyUserRequired');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

export { verifyUserRequired };
