import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import {
  createCommentController,
  readCommentsController,
  readCommentController,
  updateCommentController,
  deleteCommentController,
} from '../controllers/userComment.controller';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../schemas/comment.schema';
import { validateSchema } from '../middlewares/validator.middleware';

const userCommentRouter = Router({ mergeParams: true });

userCommentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createCommentSchema),
  createCommentController
);

userCommentRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  readCommentsController
);

userCommentRouter.get(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  readCommentController
);

userCommentRouter.put(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateCommentSchema),
  updateCommentController
);

userCommentRouter.delete(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  deleteCommentController
);

export { userCommentRouter };
