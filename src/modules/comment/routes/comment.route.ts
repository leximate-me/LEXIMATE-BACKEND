import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { createCommentSchema, updateCommentSchema } from '../comment.schema';
import { validateSchema } from '../../../common/middlewares/validator-schema.middleware';
import { CommentController } from '../comment.controller';

const commentRouter = Router({ mergeParams: true });
const commentController = new CommentController();

commentRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createCommentSchema),
  commentController.create.bind(commentController)
);

commentRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  commentController.readAll.bind(commentController)
);

commentRouter.get(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  commentController.readOne.bind(commentController)
);

commentRouter.put(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateCommentSchema),
  commentController.update.bind(commentController)
);

commentRouter.delete(
  '/:commentId',
  authRequired,
  verifyUserRequired,
  commentController.delete.bind(commentController)
);

export { commentRouter };
