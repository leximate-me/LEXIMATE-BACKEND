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
  fastify.addHook('preHandler', requireRole(['teacher', 'admin']));

  // Crear tarea
  fastify.post('/', {
    schema: createTaskSchema,
    preHandler: [uploadToStorage],
    handler: taskController.create.bind(taskController),
  });

  // Actualizar tarea
  fastify.put('/:taskId', {
    schema: updateTaskSchema,
    preHandler: [uploadToStorage],
    handler: taskController.update.bind(taskController),
  });

  // Eliminar tarea
  fastify.delete('/:taskId', taskController.delete.bind(taskController));

  fastify.post('/:taskId/submissions', {
    schema: createTaskSubmissionSchema,
    preHandler: [uploadToStorage],
    handler: taskController.createSubmission.bind(taskController),
  });

  fastify.get(
    '/:taskId/submissions',
    taskController.getSubmissionsByTask.bind(taskController)
  );

  // Obtener todas las tareas del curso
  fastify.get('/', taskController.getAllByCourse.bind(taskController));

  // Obtener una tarea por ID
  fastify.get('/:taskId', taskController.getOne.bind(taskController));

  fastify.put('/submissions/:submissionId', {
    schema: updateTaskSubmissionSchema,
    preHandler: [uploadToStorage],
    handler: taskController.updateSubmission.bind(taskController),
  });

  // Eliminar entrega
  fastify.delete(
    '/submissions/:submissionId',
    taskController.deleteSubmission.bind(taskController)
  );
}
