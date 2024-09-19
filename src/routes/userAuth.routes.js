import { Router } from 'express';
import { loginUser } from '../controllers/userAuth.controllers.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginUserSchema } from '../schemas/user.schema.js';

const userRouter = Router();

userRouter.post('/login', validateSchema(loginUserSchema), loginUser);

export { userRouter };
