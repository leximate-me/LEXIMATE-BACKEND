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

const userTaskRouter = Router();

userTaskRouter.post(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  validateSchema(createTaskSchema),
  createTaskController
);
userTaskRouter.put(
  '/:id',
  authRequired,
  verifyUserRequired,
  validateSchema(updateTaskSchema),
  updateTaskController
);
userTaskRouter.delete(
  '/:id',
  authRequired,
  verifyUserRequired,
  deleteTaskController
);
userTaskRouter.get(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  getTasksByClassController
);
userTaskRouter.get(
  '/task/:id',
  authRequired,
  verifyUserRequired,
  getTaskController
);

export { userTaskRouter };
