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
import { logger } from '../configs/loggerConfig.js';
import Cookies from 'cookies';

const registerUserController = async (req, res) => {
  try {
    const { newUser, token } = await registerUserService(req.body);
    const cookies = new Cookies(req, res);
    cookies.set('token', token);
    res.status(201).json(newUser);
  } catch (error) {
    logger.child({ error }).error('Error en registerUserController');
    res.status(400).json({ error: [error.message] });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);
    const cookies = new Cookies(req, res);
    cookies.set('token', token);
    res.status(200).json(user);
  } catch (error) {
    logger.error(error, 'Error en loginUserController');
    res.status(400).json({ error: [error.message] });
  }
};

const verifyTokenController = async (req, res) => {
  try {
    const cookies = new Cookies(req, res);
    const token = cookies.get('token');
    const { decoded } = await verifyTokenService(token);
    logger.info(decoded, 'Token verificado');
    res.status(200).json(decoded);
  } catch (error) {
    logger.error(error, 'Error en verifyTokenController');
    res.status(400).json({ error: [error.message] });
  }
};

const getProfileUserController = async (req, res) => {
  try {
    const existingUser = await getProfileUserService(req.user.id);
    logger.info(existingUser, 'Perfil de usuario obtenido');
    res.status(200).json(existingUser);
  } catch (error) {
    logger.error(error, 'Error en getProfileUserController');
    res.status(404).json({ error: [error.message] });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const response = await deleteUserService(req.user.id);
    const cookies = new Cookies(req, res);
    cookies.set('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    logger.error(error, 'Error en deleteUserController');
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const logoutUserController = async (req, res) => {
  try {
    const response = logoutUserService();
    const cookies = new Cookies(req, res);
    cookies.set('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    logger.error(error, 'Error en logoutUserController');
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const sendEmailVerificationController = async (req, res) => {
  try {
    const response = await sendEmailVerificationService(req.user.id);
    logger.child({ response }).info('Email de verificación enviado');
    res.status(200).json(response);
  } catch (error) {
    logger.error(error, 'Error en sendEmailVerificationController');
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

const verifyEmailController = async (req, res) => {
  try {
    const token = req.query.token; // Obtener el token de los parámetros de consulta
    const response = await verifyEmailService(token);
    logger.child({ response }).info('Email verificado');
    res.redirect(`${FRONTEND_URL}`);
  } catch (error) {
    logger.error(error, 'Error en verifyEmailController');
    res.status(500).json({ error: ['Error en el servidor'] });
  }
};

export {
  registerUserController,
  loginUserController,
  verifyTokenController,
  getProfileUserController,
  deleteUserController,
  logoutUserController,
  sendEmailVerificationController,
  verifyEmailController,
};
