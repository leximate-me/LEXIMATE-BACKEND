import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  verifyToken,
  getProfileUser,
  registerUser,
  deleteUser,
  sendEmailVerification,
  verifyEmail,
} from '../controllers/userAuth.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema.js';
import { authRequired } from '../middlewares/validator.token.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';

const userAuthRouter = Router();

userAuthRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  registerUser
);
userAuthRouter.post('/login', validateSchema(loginUserSchema), loginUser);
userAuthRouter.get('/verify-token', verifyToken);
userAuthRouter.post('/logout', authRequired, logoutUser);
userAuthRouter.get(
  '/profile',
  authRequired,
  verifyUserRequired,
  getProfileUser
);
userAuthRouter.delete('/delete', authRequired, verifyUserRequired, deleteUser);
userAuthRouter.post(
  '/send-email-verification',
  authRequired,
  sendEmailVerification
);
userAuthRouter.get('/verify-email', verifyEmail);

export { userAuthRouter };
