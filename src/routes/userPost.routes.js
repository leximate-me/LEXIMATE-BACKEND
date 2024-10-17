import { Router } from 'express';
import { createPostController } from '../controllers/userPost.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';

const userPostRouter = Router();

userPostRouter.post(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  createPostController
);

export { userPostRouter };
