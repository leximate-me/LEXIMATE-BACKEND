import {
  loginUserService,
  logoutUserService,
  verifyTokenService,
  getProfileUserService,
  registerUserService,
} from '../services/userAuth.service.js';

const registerUser = async (req, res) => {
  try {
    const { newUser, token } = await registerUserService(req.body);
    res.cookie('token', token);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

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

const verifyToken = async (req, res) => {
  try {
    const { decoded } = await verifyTokenService(req.cookies.token);
    console.log(decoded);
    res.status(200).json(decoded);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: [error.message] });
  }
};

const getProfileUser = async (req, res) => {
  try {
    const existingUser = await getProfileUserService(req.user.id);
    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: [error.message] });
  }
};

const logoutUser = async (req, res) => {
  try {
    const response = logoutUserService();
    res.clearCookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export { loginUser, verifyToken, getProfileUser, logoutUser, registerUser };
