import { Router } from 'express';

import { authRequired } from '../../../common/middlewares/token.middleware';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { commentRouter } from '../../comment/routes/comment.route';
import { createPostSchema, updatePostSchema } from '../post.schema';
import { validateSchema } from '../../../common/middlewares/validator-schema.middleware';
import { PostController } from '../post.controller';

const postRouter = Router({ mergeParams: true });
const postController = new PostController();

postRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createPostSchema),
  postController.create.bind(postController)
);

postRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  postController.readAll.bind(postController)
);

postRouter.get(
  '/:postId',
  authRequired,
  verifyUserRequired,
  postController.readOne.bind(postController)
);

postRouter.put(
  '/:postId',
  authRequired,
  verifyUserRequired,
  validateSchema(updatePostSchema),
  postController.update.bind(postController)
);

postRouter.delete(
  '/:postId',
  authRequired,
  verifyUserRequired,
  postController.delete.bind(postController)
);

postRouter.use('/:postId/comment', commentRouter);

export { postRouter };
