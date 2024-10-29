import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema.js';
import {
  registerUserController,
  loginUserController,
  verifyTokenController,
  getProfileUserController,
  deleteUserController,
  logoutUserController,
  sendEmailVerificationController,
  verifyEmailController,
} from '../controllers/userAuth.controller.js';

const userAuthRouter = Router();

userAuthRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  registerUserController
);
userAuthRouter.post(
  '/login',
  validateSchema(loginUserSchema),
  loginUserController
);
userAuthRouter.get('/verify-token', verifyTokenController);
userAuthRouter.post('/logout', authRequired, logoutUserController);
userAuthRouter.get(
  '/profile',
  authRequired,
  verifyUserRequired,
  getProfileUserController
);
userAuthRouter.delete(
  '/delete',
  authRequired,
  verifyUserRequired,
  deleteUserController
);
userAuthRouter.post(
  '/send-email-verification',
  authRequired,
  sendEmailVerificationController
);
userAuthRouter.get('/verify-email', verifyEmailController);

export { userAuthRouter };
