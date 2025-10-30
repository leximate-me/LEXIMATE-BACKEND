import { FastifyInstance } from 'fastify';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { commentRouter } from '../../comment/routes/comment.route';
import { PostController } from '../post.controller';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

export async function postRouter(fastify: FastifyInstance) {
  const postController = new PostController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  fastify.addHook('preHandler', requireRole(['student', 'teacher', 'admin']));

  // Crear post
  fastify.post('/', {
    preHandler: [validateDto(CreatePostDto)],
    handler: postController.create.bind(postController),
  });

  // Obtener todos los posts
  fastify.get('/', postController.readAll.bind(postController));

  // Obtener un post por ID
  fastify.get('/:postId', postController.readOne.bind(postController));

  // Actualizar post
  fastify.put('/:postId', {
    preHandler: [validateDto(UpdatePostDto)],
    handler: postController.update.bind(postController),
  });

  // Eliminar post
  fastify.delete('/:postId', postController.delete.bind(postController));

  // Anidar el router de comentarios
  await fastify.register(commentRouter, { prefix: '/:postId/comment' });
}
