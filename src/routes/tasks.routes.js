import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controllers.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas.js';

const taskRouter = Router();

taskRouter.get('/tasks', authRequired, getTasks);
taskRouter.post(
  '/tasks',
  authRequired,
  validateSchema(createTaskSchema),
  createTask
);
taskRouter.get('/tasks/:id', authRequired, getTask);
taskRouter.put(
  '/tasks/:id',
  authRequired,
  validateSchema(updateTaskSchema),
  updateTask
);
taskRouter.delete('/tasks/:id', authRequired, deleteTask);

export { taskRouter };
