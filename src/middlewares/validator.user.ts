import { User } from '../models/user.model.js';
import { logger } from '../configs/loggerConfig.js';
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
      res.status(401).json({ error: ['Usuario no verificado'] });
    }

    next();
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
