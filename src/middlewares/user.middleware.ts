import { User } from '../models/user.model';
import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';

const verifyUserRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.user?.id;

    const user = await User.findByPk(id);

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
