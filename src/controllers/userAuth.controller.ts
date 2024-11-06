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
  updateProfileUserService,
} from '../services/userAuth.service';
import { Request, Response } from 'express';

const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.body;

    const { newUser, token } = await registerUserService(userData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    if (!newUser) {
      res.status(400).json({ error: ['Error al registrar el usuario'] });
    }

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en registerUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en registerUserController');
      res.status(500).json({ error: ['Error interno del servidor'] });
    }
  }
};

const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.body;
    const { user, token } = await loginUserService(userData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message, 'Error en loginUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en loginUserController');
      res.status(500).json({ error: ['Error interno del servidor'] });
    }
  }
};

const verifyTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.token as string;

    if (!token) {
      res.status(400).json({ error: ['Token no proporcionado'] });
      return;
    }

    const decoded = await verifyTokenService(token);

    logger.info(decoded, 'Token verificado');

    res.status(200).json(decoded);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en verifyTokenController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en verifyTokenController');
      res.status(500).json({ error: ['Error interno del servidor'] });
    }
  }
};

const getProfileUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as number;

    if (!userId) {
      res.status(400).json({ error: ['Usuario no encontrado'] });
      return;
    }

    const existingUser = await getProfileUserService(userId);

    res.status(200).json(existingUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en getProfileUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en getProfileUserController');
      res.status(500).json({ error: ['Error interno del servidor'] });
    }
  }
};

const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as number;

    if (!userId) {
      res.status(400).json({ error: ['Usuario no encontrado'] });
      return;
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
      res.status(500).json({ error: ['Error interno del servidor'] });
    }
  }
};

const logoutUserController = async (
  _req: Request,
  res: Response
): Promise<void> => {
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

const sendEmailVerificationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as number;

    if (!userId) {
      res.status(400).json({ error: ['Usuario no encontrado'] });
      return;
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

const verifyEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token as string;

    if (!token) {
      res.status(400).json({ error: ['Token no proporcionado'] });
      return;
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

const updateProfileUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as number;
    const userData = req.body;

    let fileUrl, fileId, fileType;

    if (req.file && req.file.cloudinaryUrl) {
      fileUrl = req.file.cloudinaryUrl;
      fileId = req.file.cloudinaryPublicId;
      fileType = req.file.mimetype;
    }

    const imageProps = {
      fileUrl: fileUrl || '',
      fileId: fileId || '',
      fileType: fileType || '',
    };

    const updatedUser = await updateProfileUserService(
      userId,
      userData,
      imageProps
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en updateProfileUserController');
      res.status(400).json({ error: [error.message] });
    } else {
      logger.error(error, 'Error desconocido en updateProfileUserController');
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
  updateProfileUserController,
};
