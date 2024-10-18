import { Router } from 'express';
import {
  createPostController,
  readPostController,
  updatePostController,
  deletePostController,
} from '../controllers/userPost.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';

const userPostRouter = Router();

userPostRouter.post(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  createPostController
);

userPostRouter.get(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  readPostController
);

userPostRouter.put(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  updatePostController
);

userPostRouter.delete(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  deletePostController
);

export { userPostRouter };
