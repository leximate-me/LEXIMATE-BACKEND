import { Router } from 'express';
import {
  login,
  logout,
  profile,
  register,
  verifyToken,
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/logout', logout);
authRouter.get('/profile', profile);
authRouter.get('/verify-token', verifyToken);

export { authRouter };
