import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { authRequired } from '../middlewares/validator.token.js';
import { createCommentController } from '../controllers/userComment.controller.js';

const userCommentRouter = Router({ mergeParams: true });

userCommentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  createCommentController
);

export { userCommentRouter };
