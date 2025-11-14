import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { uploadToStorage } from '../../../common/middlewares/upload.middleware';
import { TaskController } from '../task.controller';

import { requireRole } from '../../../common/middlewares/auth.middleware';

import { createTaskSchema } from '../schemas/create-task.schema';
import { updateTaskSchema } from '../schemas/update-task.schema';
import { createTaskSubmissionSchema } from '../schemas/create-tak-submission.schema';
import { updateTaskSubmissionSchema } from '../schemas/update-task-submission.dto';

export async function taskRouter(fastify: FastifyInstance) {
  const taskController = new TaskController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);

  // Crear tarea
  fastify.post('/', {
    schema: createTaskSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.create.bind(taskController),
  });

  // Actualizar tarea
  fastify.put('/:taskId', {
    schema: updateTaskSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.update.bind(taskController),
  });

  // Eliminar tarea
  fastify.delete('/:taskId', {
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.delete.bind(taskController),
  });

  fastify.post('/:taskId/submissions', {
    schema: createTaskSubmissionSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.createSubmission.bind(taskController),
  });

  fastify.patch('/:taskId/submissions/:studentId/qualify', {
    schema: updateTaskSubmissionSchema,
    preValidation: [authRequired],
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: taskController.qualifySubmission.bind(taskController),
  });

  fastify.get('/:taskId/submissions', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.getSubmissionsByTask.bind(taskController),
  });

  // Obtener todas las tareas del curso
  fastify.get('/', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.getAllByCourse.bind(taskController),
  });

  // Obtener una tarea por ID
  fastify.get('/:taskId', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.getOne.bind(taskController),
  });

  fastify.put('/submissions/:submissionId', {
    schema: updateTaskSubmissionSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.updateSubmission.bind(taskController),
  });

  // Eliminar entrega
  fastify.delete('/submissions/:submissionId', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: taskController.deleteSubmission.bind(taskController),
  });
}
