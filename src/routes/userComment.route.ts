import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import { createCommentController } from '../controllers/userComment.controller';

const userCommentRouter = Router({ mergeParams: true });

userCommentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  createCommentController
);

export { userCommentRouter };
