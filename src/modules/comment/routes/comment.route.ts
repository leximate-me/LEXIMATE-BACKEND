import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { CommentController } from '../comment.controller';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { createCommentSchema } from '../schemas/create-comment.schema';
import { updateCommentSchema } from '../schemas/update-comment.schema';

export async function commentRouter(fastify: FastifyInstance) {
  const commentController = new CommentController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  fastify.addHook('preHandler', requireRole(['admin', 'student', 'teacher']));

  // Crear comentario
  fastify.post('/', {
    schema: createCommentSchema,
    handler: commentController.create.bind(commentController),
  });

  // Obtener todos los comentarios
  fastify.get('/', commentController.readAll.bind(commentController));

  // Obtener un comentario por ID
  fastify.get('/:commentId', commentController.readOne.bind(commentController));

  // Actualizar comentario
  fastify.put('/:commentId', {
    schema: updateCommentSchema,
    handler: commentController.update.bind(commentController),
  });

  // Eliminar comentario
  fastify.delete(
    '/:commentId',
    commentController.delete.bind(commentController)
  );
}
