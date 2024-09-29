import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  verifyToken,
  getProfileUser,
  registerUser,
  deleteUser,
} from '../controllers/userAuth.controllers.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema.js';
import { authRequired } from '../middlewares/validator.token.js';

const userAuthRouter = Router();

userAuthRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  registerUser
);
userAuthRouter.post('/login', validateSchema(loginUserSchema), loginUser);
userAuthRouter.get('/verify-token', verifyToken);
userAuthRouter.post('/logout', logoutUser);
userAuthRouter.get('/profile', authRequired, getProfileUser);
userAuthRouter.delete('/delete', authRequired, deleteUser);

export { userAuthRouter };
