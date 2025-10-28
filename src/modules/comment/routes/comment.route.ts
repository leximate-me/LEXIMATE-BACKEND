import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { CommentController } from '../comment.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { requireRole } from '../../../common/middlewares/auth.middleware';

const commentRouter = Router({ mergeParams: true });
const commentController = new CommentController();

// Aplica el middleware de autenticación a todas las rutas
commentRouter.use(authRequired);
commentRouter.use(verifyUserRequired);
commentRouter.use(requireRole(['student', 'teacher']));

commentRouter.post(
  '/',
  validateDto(CreateCommentDto),
  commentController.create.bind(commentController)
);

commentRouter.get('/', commentController.readAll.bind(commentController));

commentRouter.get(
  '/:commentId',
  commentController.readOne.bind(commentController)
);

commentRouter.put(
  '/:commentId',
  validateDto(UpdateCommentDto),
  commentController.update.bind(commentController)
);

commentRouter.delete(
  '/:commentId',
  commentController.delete.bind(commentController)
);

export { commentRouter };
