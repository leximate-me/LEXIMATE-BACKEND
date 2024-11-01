import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import { createCommentController } from '../controllers/userComment.controller';
import { createCommentSchema } from '../schemas/comment.schema';
import { validateSchema } from '../middlewares/validator.middleware';

const userCommentRouter = Router({ mergeParams: true });

userCommentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createCommentSchema),
  createCommentController
);

export { userCommentRouter };
