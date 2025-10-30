import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { postRouter } from '../../post/routes/post.route';
import { CourseController } from '../course.controller';
import { taskRouter } from '../../task/routes/task.route';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

export async function courseRouter(fastify: FastifyInstance) {
  const courseController = new CourseController();

  // Middleware global para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  // Anida los routers de tareas y posts
  fastify.register(taskRouter, { prefix: '/:courseId/task' });
  fastify.register(postRouter, { prefix: '/:courseId/post' });

  fastify.post('/', {
    preHandler: [
      requireRole(['admin', 'teacher']),
      validateDto(CreateCourseDto),
    ],
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
    preHandler: [
      requireRole(['admin', 'teacher']),
      validateDto(UpdateCourseDto),
    ],
    handler: courseController.update.bind(courseController),
  });

  fastify.delete('/:courseId', {
    preHandler: [requireRole(['admin', 'teacher'])],
    handler: courseController.delete.bind(courseController),
  });
}
