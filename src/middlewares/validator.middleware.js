import { logger } from '../configs/loggerConfig.js';

const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      logger.child({ error }).error('Error en validateSchema');
      res.status(400).json({ error: error.errors.map((err) => err.message) });
    }
  };
};

export { validateSchema };
