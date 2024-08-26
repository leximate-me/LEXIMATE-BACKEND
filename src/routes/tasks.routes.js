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

taskRouter.get('/', authRequired, getTasks);
taskRouter.post(
  '/',
  authRequired,
  validateSchema(createTaskSchema),
  createTask
);
taskRouter.get('/:id', authRequired, getTask);
taskRouter.put(
  '/:id',
  authRequired,
  validateSchema(updateTaskSchema),
  updateTask
);
taskRouter.delete('/:id', authRequired, deleteTask);

export { taskRouter };
