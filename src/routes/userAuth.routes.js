import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  verifyToken,
} from '../controllers/userAuth.controllers.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema } from '../schemas/user.schema.js';

const userAuthRouter = Router();

userAuthRouter.post('/login', validateSchema(loginUserSchema), loginUser);
userAuthRouter.get('/verify-token', verifyToken);
userAuthRouter.post('/logout', logoutUser);

export { userAuthRouter };
