import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../common/configs/logger.config';
import { EnvConfiguration } from '../../common/configs/env.config';

export class AuthController {
  private authService: AuthService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { newUser, token } = await this.authService.registerUser(req.body);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(201).json({ newUser, token });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await this.authService.loginUser(req.body);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(' ')[1];

      logger.info(token);

      const decoded = await this.authService.verifyToken(token);

      logger.info(decoded, 'Token verificado');

      res.status(200).json(decoded);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const existingUser = await this.authService.getProfileUser(userId);

      res.status(200).json(existingUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const response = await this.authService.deleteUser(userId);

      res.cookie('token', '', { expires: new Date(0) });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  }

  async sendEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const response = await this.authService.sendEmailVerification(userId);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;

      const response = await this.authService.verifyEmail(token);

      res.redirect(`${EnvConfiguration().frontendUrl}`);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  }
}
