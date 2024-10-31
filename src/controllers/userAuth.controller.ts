import { FRONTEND_URL } from '../configs/env.config';
import { logger } from '../configs/logger.config';
import {
  loginUserService,
  logoutUserService,
  verifyTokenService,
  getProfileUserService,
  registerUserService,
  deleteUserService,
  sendEmailVerificationService,
  verifyEmailService,
} from '../services/userAuth.service';
import { Request, Response } from 'express';

const registerUserController = async (req: Request, res: Response) => {
  try {
    const { newUser, token } = await registerUserService(req.body);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en registerUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en registerUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const loginUserController = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    const { user, token } = await loginUserService(userData);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en loginUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en loginUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const verifyTokenController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const { decoded } = await verifyTokenService(token);
    logger.info(decoded, 'Token verificado');
    res.status(200).json(decoded);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en verifyTokenController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en verifyTokenController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const getProfileUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (userId === undefined) {
      throw new Error('Usuario no encontrado');
    }

    const existingUser = await getProfileUserService(userId);
    logger.info(existingUser, 'Perfil de usuario obtenido');
    res.status(200).json(existingUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getProfileUserController');
      res.status(404).json({ error: [error.message] });
    }
    {
      logger.error(error, 'Error desconocido en getProfileUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (userId === undefined) {
      throw new Error('Usuario no encontrado');
    }

    const response = await deleteUserService(userId);
    res.cookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en deleteUserController');
      res.status(404).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en deleteUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const logoutUserController = async (_req: Request, res: Response) => {
  try {
    const response = logoutUserService();
    res.cookie('token', '', { expires: new Date(0) });
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en logoutUserController');
      res.status(404).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en logoutUserController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const sendEmailVerificationController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (userId === undefined) {
      throw new Error('Usuario no encontrado');
    }

    const response = await sendEmailVerificationService(userId);
    logger.child({ response }).info('Email de verificación enviado');
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en sendEmailVerificationController');
      res.status(500).json({ error: [error.message] });
    } else {
      logger.error(
        error,
        'Error desconocido en sendEmailVerificationController'
      );
      res.status(500).json({ error: ['Error desconocido'] });
    }
  }
};

const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const token = req.query.token; // Obtener el token de los parámetros de consulta

    if (typeof token !== 'string') {
      throw new Error('Token no proporcionado');
    }

    const response = await verifyEmailService(token);
    logger.child({ response }).info('Email verificado');
    res.redirect(`${FRONTEND_URL}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en verifyEmailController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en verifyEmailController');
      res.status(500).json({ error: ['Error desconocido'] });
    }
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
