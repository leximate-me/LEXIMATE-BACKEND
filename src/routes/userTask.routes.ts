import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
} from '../controllers/userTask.controller.js';

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
