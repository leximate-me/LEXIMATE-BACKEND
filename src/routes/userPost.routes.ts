import { Router } from 'express';
import {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
} from '../controllers/userPost.controller';
import { authRequired } from '../middlewares/validator.token';
import { verifyUserRequired } from '../middlewares/validator.user';
import { userCommentRouter } from './userComment.routes';

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

userPostRouter.use('/:postId/comment', userCommentRouter);

export { userPostRouter };
