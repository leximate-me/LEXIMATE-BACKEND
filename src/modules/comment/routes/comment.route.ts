import { FastifyInstance } from 'fastify';
import {
  authRequired,
  requireRole,
  verifyUserRequired,
} from '@common/middlewares';
import { createCommentSchema, updateCommentSchema } from '@comment/schemas';
import { paginationSchema } from '@common/schemas/pagination.schema';
import { CommentController } from '@modules/comment/controllers/comment.controller';

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
  fastify.get('/', {
    schema: paginationSchema,
    handler: commentController.readAll.bind(commentController),
  });

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
