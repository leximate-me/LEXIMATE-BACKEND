import { User } from '../models/user.model.js';
import { logger } from '../configs/loggerConfig.js';

const verifyUserRequired = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findByPk(id);

    if (user.verified !== true) {
      logger.error('Usuario no verificado');
      return res.status(401).json({ error: ['Usuario no verificado'] });
    }

    next();
  } catch (error) {
    logger.child({ error }).error('Error en verifyUserRequired');
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { verifyUserRequired };
