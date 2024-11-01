// import { logger } from '../configs/logger.config';
import { Request, Response, NextFunction } from 'express';
import { Schema, ZodError } from 'zod';
import { deleteFromCloudinary } from './upload.middleware';

const validateSchema = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (req.file && req.file.cloudinaryPublicId) {
        await deleteFromCloudinary(req.file.cloudinaryPublicId, next);
        console.log('Archivo eliminado de Cloudinary');
      }
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors.map((err) => err.message) });
      } else {
        next(error); // Propagar el error al siguiente middleware o controlador
      }
    }
  };
};

export { validateSchema };
