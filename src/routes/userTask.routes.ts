import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user';
import { authRequired } from '../middlewares/validator.token';
import { validateSchema } from '../middlewares/validator.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
} from '../controllers/userTask.controller';

const userTaskRouter = Router({ mergeParams: true }); // Permitir el uso de parametros de rutas padres

userTaskRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createTaskSchema),
  createTaskController
);
userTaskRouter.put(
  '/:taskId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateTaskSchema),
  updateTaskController
);
userTaskRouter.delete(
  '/:taskId',
  authRequired,
  verifyUserRequired,
  deleteTaskController
);
userTaskRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  getTasksByClassController
);
userTaskRouter.get(
  '/:taskId',
  authRequired,
  verifyUserRequired,
  getTaskController
);

export { userTaskRouter };
