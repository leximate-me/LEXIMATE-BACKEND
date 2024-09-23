import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  verifyToken,
  getProfileUser,
  registerUser,
} from '../controllers/userAuth.controllers.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema } from '../schemas/user.schema.js';
import { authRequired } from '../middlewares/validator.token.js';

const userAuthRouter = Router();

userAuthRouter.post('/register', registerUser);
userAuthRouter.post('/login', validateSchema(loginUserSchema), loginUser);
userAuthRouter.get('/verify-token', verifyToken);
userAuthRouter.post('/logout', logoutUser);
userAuthRouter.get('/profile', authRequired, getProfileUser);

export { userAuthRouter };
