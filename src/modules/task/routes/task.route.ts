import { FastifyInstance } from 'fastify';
import { uploadToStorage } from '@common/middlewares/upload.middleware';
import { requireRole } from '@common/middlewares/auth.middleware';

import { taskSubmissionRouter } from '@task/routes/task-submission.route';
import { TaskController } from '@task/controllers/task.controller';
import { createTaskSchema, updateTaskSchema } from '@task/schemas';
import { paginationSchema } from '@common/schemas/pagination.schema';


export async function taskRouter(fastify: FastifyInstance) {
  const taskController = new TaskController();

  fastify.post('/', {
    schema: createTaskSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.create.bind(taskController),
  });

  fastify.get('/', {
    schema: paginationSchema,
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.getAllByCourse.bind(taskController),
  });

  fastify.get('/:taskId', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.getOne.bind(taskController),
  });

  fastify.put('/:taskId', {
    schema: updateTaskSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.update.bind(taskController),
  });

  fastify.delete('/:taskId', {
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.delete.bind(taskController),
  });
  fastify.register(taskSubmissionRouter);
}
