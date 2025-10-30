import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { uploadToStorage } from '../../../common/middlewares/upload.middleware';
import { TaskController } from '../task.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { UpdateTaskSubmissionDto } from '../dtos/update-task-submission';
import { CreateTaskSubmissionDto } from '../dtos/create-task-submission';

export async function taskRouter(fastify: FastifyInstance) {
  const taskController = new TaskController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  fastify.addHook('preHandler', requireRole(['teacher', 'admin']));

  // Crear tarea
  fastify.post('/', {
    preHandler: [uploadToStorage, validateDto(CreateTaskDto)],
    handler: taskController.create.bind(taskController),
  });

  // Actualizar tarea
  fastify.put('/:taskId', {
    preHandler: [uploadToStorage, validateDto(UpdateTaskDto)],
    handler: taskController.update.bind(taskController),
  });

  // Eliminar tarea
  fastify.delete('/:taskId', taskController.delete.bind(taskController));

  fastify.post('/:taskId/submissions', {
    preHandler: [uploadToStorage, validateDto(CreateTaskSubmissionDto)],
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
    preHandler: [validateDto(UpdateTaskSubmissionDto)],
    handler: taskController.updateSubmission.bind(taskController),
  });

  // Eliminar entrega
  fastify.delete(
    '/submissions/:submissionId',
    taskController.deleteSubmission.bind(taskController)
  );
}
