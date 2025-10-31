import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { postRouter } from '../../post/routes/post.route';
import { CourseController } from '../course.controller';
import { taskRouter } from '../../task/routes/task.route';
import { createCourseSchema } from '../schemas/create-course.schema';
import { updateCourseSchema } from '../schemas/update-course.schema';

export async function courseRouter(fastify: FastifyInstance) {
  const courseController = new CourseController();

  // Middleware global para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  // Anida los routers de tareas y posts
  fastify.register(taskRouter, { prefix: '/:courseId/task' });
  fastify.register(postRouter, { prefix: '/:courseId/post' });

  fastify.post('/', {
    schema: createCourseSchema,
    handler: courseController.create.bind(courseController),
  });

  fastify.post('/join', {
    preHandler: [requireRole(['student'])],
    handler: courseController.join.bind(courseController),
  });

  fastify.post('/:courseId/leave', {
    preHandler: [requireRole(['student'])],
    handler: courseController.leave.bind(courseController),
  });

  fastify.get(
    '/user',
    courseController.getClassesByUser.bind(courseController)
  );

  fastify.get(
    '/:courseId/user',
    courseController.getUsersByClass.bind(courseController)
  );

  fastify.put('/:courseId', {
    schema: updateCourseSchema,
    preHandler: [requireRole(['admin', 'teacher'])],
    handler: courseController.update.bind(courseController),
  });

  fastify.delete('/:courseId', {
    preHandler: [requireRole(['admin', 'teacher'])],
    handler: courseController.delete.bind(courseController),
  });
}
