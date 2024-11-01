import { Router } from 'express';
import {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
} from '../controllers/userPost.controller';
import { authRequired } from '../middlewares/token.middleware';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { userCommentRouter } from './userComment.route';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';
import { validateSchema } from '../middlewares/validator.middleware';

const userPostRouter = Router({ mergeParams: true });

userPostRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createPostSchema),
  createPostController
);

userPostRouter.get('/', authRequired, verifyUserRequired, readPostsController);

userPostRouter.put(
  '/:postId',
  authRequired,
  verifyUserRequired,
  validateSchema(updatePostSchema),
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
