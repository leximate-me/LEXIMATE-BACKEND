import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { validateSchema } from '../../../common/middlewares/validator.middleware';
import { loginUserSchema, registerUserSchema } from '../user.schema';
import { upload } from '../../../common/configs/upload.config';
import { uploadToCloudinary } from '../../../common/middlewares/upload.middleware';
import { AuthController } from '../auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  authController.register.bind(authController)
);

authRouter.post(
  '/login',
  validateSchema(loginUserSchema),
  authController.login.bind(authController)
);

authRouter.get('/seed-roles', authController.seedRoles.bind(authController));

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
