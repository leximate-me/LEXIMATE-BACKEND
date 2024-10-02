import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
} from '../controllers/userTask.controller.js';
import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';

const userTaskRouter = Router();

userTaskRouter.post(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  createTaskController
);
userTaskRouter.put(
  '/:id',
  authRequired,
  verifyUserRequired,
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
