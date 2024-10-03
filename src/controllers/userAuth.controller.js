import {
  loginUserService,
  logoutUserService,
  verifyTokenService,
  getProfileUserService,
  registerUserService,
  deleteUserService,
  sendEmailVerificationService,
  verifyEmailService,
} from '../services/userAuth.service.js';
import { FRONTEND_URL } from '../configs/envConfig.js';

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
    console.log(req.user);
    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: [error.message] });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await deleteUserService(req.user.id);
    res.clearCookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
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

const sendEmailVerification = async (req, res) => {
  try {
    const response = await sendEmailVerificationService(req.user.id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token; // Obtener el token de los parámetros de consulta
    const response = await verifyEmailService(token);
    console.log(response);
    res.redirect(`${FRONTEND_URL}/login`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export {
  loginUser,
  verifyToken,
  getProfileUser,
  logoutUser,
  registerUser,
  deleteUser,
  sendEmailVerification,
  verifyEmail,
};
