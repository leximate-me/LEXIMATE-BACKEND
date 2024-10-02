import { User } from '../models/user.model.js';

const verifyUserRequired = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log('id de usuario', id);

    const user = await User.findByPk(id);

    if (user.verified !== true) {
      return res.status(401).json({ error: ['Usuario no vericado'] });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { verifyUserRequired };
