import { User } from '../models/user.model.js';

const verifyUserRequired = async (req, res, next) => {
  try {
    const { id, verify } = req.user;
    console.log('id de usuario', id);
    console.log('verificado', verify);

    if (!verify) {
      return res.status(403).json({ error: ['Usuario no verificado'] });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { verifyUserRequired };
