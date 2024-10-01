import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
} from '../controllers/userTask.controller.js';
import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';

const userTaskRouter = Router();

userTaskRouter.post('/:classCode', authRequired, createTaskController);
userTaskRouter.put('/:id', authRequired, updateTaskController);
userTaskRouter.delete('/:id', authRequired, deleteTaskController);
userTaskRouter.get('/:classCode', authRequired, getTasksByClassController);
userTaskRouter.get('/task/:id', authRequired, getTaskController);

export { userTaskRouter };
