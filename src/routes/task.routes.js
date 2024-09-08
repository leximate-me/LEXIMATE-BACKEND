import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';

import {
  createTask,
  getTasksByClass,
  updateTask,
  deleteTask,
} from '../controllers/task.controllers.js';

const taskRouter = Router();

taskRouter.post('/:classId/tasks', authRequired, createTask);
taskRouter.get('/:classId/tasks', authRequired, getTasksByClass);
taskRouter.put('/:classId/tasks/:taskId', authRequired, updateTask);
taskRouter.delete('/:classId/tasks/:taskId', authRequired, deleteTask);

export { taskRouter };
