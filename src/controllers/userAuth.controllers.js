import { loginUserService } from '../services/userAuth.service.js';

const loginUser = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);
    res.cookie('token', token);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

export { loginUser };
