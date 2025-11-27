import { FastifyInstance } from 'fastify';
import {
  verifyUserRequired,
  authRequired,
  requireRole,
} from '@common/middlewares';

import { postRouter } from '@post/routes/post.route';
import { taskRouter } from '@task/routes/task.route';

import { createCourseSchema, updateCourseSchema } from '@course/schemas';
import { paginationSchema } from '@common/schemas/pagination.schema';

import { CourseController } from '@modules/course/controllers/course.controller';

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
    preHandler: [requireRole(['student', 'teacher'])],
    handler: courseController.join.bind(courseController),
  });

  fastify.post('/:courseId/leave', {
    preHandler: [requireRole(['student', 'teacher'])],
    handler: courseController.leave.bind(courseController),
  });

  fastify.get(
    '/user',
    {
      schema: paginationSchema,
      handler: courseController.getClassesByUser.bind(courseController),
    }
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
