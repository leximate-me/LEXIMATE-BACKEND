import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user';
import { authRequired } from '../middlewares/validator.token';
import { createCommentController } from '../controllers/userComment.controller';

const userCommentRouter = Router({ mergeParams: true });

userCommentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  createCommentController
);

export { userCommentRouter };
