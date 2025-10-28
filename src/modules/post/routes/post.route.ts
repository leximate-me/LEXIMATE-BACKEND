import { Router } from 'express';

import { authRequired } from '../../../common/middlewares/token.middleware';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { commentRouter } from '../../comment/routes/comment.route';
import { PostController } from '../post.controller';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

const postRouter = Router({ mergeParams: true });
const postController = new PostController();

postRouter.use(authRequired);
postRouter.use(verifyUserRequired);
postRouter.use(requireRole(['student', 'teacher', 'admin']));

postRouter.post(
  '/',

  validateDto(CreatePostDto),
  postController.create.bind(postController)
);

postRouter.get(
  '/',

  postController.readAll.bind(postController)
);

postRouter.get(
  '/:postId',

  postController.readOne.bind(postController)
);

postRouter.put(
  '/:postId',

  validateDto(UpdatePostDto),
  postController.update.bind(postController)
);

postRouter.delete(
  '/:postId',

  postController.delete.bind(postController)
);

postRouter.use('/:postId/comment', commentRouter);

export { postRouter };
