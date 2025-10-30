import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { CommentController } from '../comment.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { requireRole } from '../../../common/middlewares/auth.middleware';

export async function commentRouter(fastify: FastifyInstance) {
  const commentController = new CommentController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  fastify.addHook('preHandler', requireRole(['student', 'teacher']));

  // Crear comentario
  fastify.post('/', {
    preHandler: [validateDto(CreateCommentDto)],
    handler: commentController.create.bind(commentController),
  });

  // Obtener todos los comentarios
  fastify.get('/', commentController.readAll.bind(commentController));

  // Obtener un comentario por ID
  fastify.get('/:commentId', commentController.readOne.bind(commentController));

  // Actualizar comentario
  fastify.put('/:commentId', {
    preHandler: [validateDto(UpdateCommentDto)],
    handler: commentController.update.bind(commentController),
  });

  // Eliminar comentario
  fastify.delete(
    '/:commentId',
    commentController.delete.bind(commentController)
  );
}
