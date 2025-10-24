import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../common/configs/logger.config';
import { FRONTEND_URL } from '../../common/configs/env.config';

export class AuthController {
  private authService: AuthService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { newUser, token } = await this.authService.registerUser(userData);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
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
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { user, token } = await this.authService.loginUser(userData);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error en loginUserController: ${error.message}`);
        res.status(400).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en loginUserController');
        res.status(500).json({ error: ['Error interno del servidor'] });
      }
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token as string;

      if (!token) {
        res.status(400).json({ error: ['Token no proporcionado'] });
        return;
      }

      const decoded = await this.authService.verifyToken(token);

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
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ error: ['Usuario no encontrado'] });
        return;
      }

      const existingUser = await this.authService.getProfileUser(userId);

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
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ error: ['Usuario no encontrado'] });
        return;
      }

      const response = await this.authService.deleteUser(userId);

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
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      const response = this.authService.logoutUser();

      res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

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
  }

  async sendEmailVerification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ error: ['Usuario no encontrado'] });
        return;
      }

      const response = await this.authService.sendEmailVerification(userId);

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
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const token = req.query.token as string;

      if (!token) {
        res.status(400).json({ error: ['Token no proporcionado'] });
        return;
      }

      const response = await this.authService.verifyEmail(token);

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
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
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

      const updatedUser = await this.authService.updateProfileUser(
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
  }

  async seedRoles(_req: Request, res: Response): Promise<void> {
    try {
      const response = await this.authService.seedRoles();
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en seedRolesController');
        res.status(500).json({ error: [error.message] });
      } else {
        logger.error(error, 'Error desconocido en seedRolesController');
        res.status(500).json({ error: ['Error desconocido'] });
      }
    }
  }
}
