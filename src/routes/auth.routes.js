import { Router } from 'express';
import {
  login,
  logout,
  profile,
  register,
  verifyToken,
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

const authRouter = Router();

authRouter.post('/register', validateSchema(registerSchema), register);
authRouter.post('/login', validateSchema(loginSchema), login);
authRouter.get('/logout', logout);
authRouter.get('/profile', authRequired, profile);
authRouter.get('/verify-token', authRequired, verifyToken);

export { authRouter };
