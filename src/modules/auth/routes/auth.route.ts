import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { upload } from '../../../common/configs/upload.config';
import { uploadToCloudinary } from '../../../common/middlewares/upload.middleware';
import { AuthController } from '../auth.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { RegisterAuthDto } from '../dtos/register-auth.dto';
import { LoginAuthDto } from '../dtos/login-auth.dto';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validateDto(RegisterAuthDto),
  authController.register.bind(authController)
);

authRouter.post(
  '/login',
  validateDto(LoginAuthDto),
  authController.login.bind(authController)
);

authRouter.get(
  '/verify-token',
  authController.verifyToken.bind(authController)
);

authRouter.post(
  '/logout',
  authRequired,
  authController.logout.bind(authController)
);

authRouter.get(
  '/profile',
  authRequired,
  authController.getProfile.bind(authController)
);

authRouter.delete(
  '/delete',
  authRequired,
  verifyUserRequired,
  authController.delete.bind(authController)
);

authRouter.post(
  '/send-email-verification',
  authRequired,
  authController.sendEmailVerification.bind(authController)
);

authRouter.get(
  '/verify-email',
  authRequired,
  authController.verifyEmail.bind(authController)
);

authRouter.put(
  '/update-profile',
  authRequired,
  upload,
  uploadToCloudinary,
  verifyUserRequired,
  authController.updateProfile.bind(authController)
);

export { authRouter };
