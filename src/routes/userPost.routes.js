import { Router } from 'express';
import {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
} from '../controllers/userPost.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';

const userPostRouter = Router({ mergeParams: true });

userPostRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  createPostController
);

userPostRouter.get('/', authRequired, verifyUserRequired, readPostsController);

userPostRouter.put(
  '/:postId',
  authRequired,
  verifyUserRequired,
  updatePostController
);

userPostRouter.delete(
  '/:postId',
  authRequired,
  verifyUserRequired,
  deletePostController
);

userPostRouter.get(
  '/:postId',
  authRequired,
  verifyUserRequired,
  readPostController
);

export { userPostRouter };
