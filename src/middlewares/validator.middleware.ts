import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';
import { Schema, ZodError } from 'zod';

const validateSchema = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error, 'Error en validateSchema');
        res.status(400).json({ error: error.errors });
      } else {
        logger.error(error, 'Error desconocido en validateSchema');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  };
};

export { validateSchema };
