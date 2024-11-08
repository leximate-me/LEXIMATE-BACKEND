import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import { validateSchema } from '../middlewares/validator.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksByClassController,
  getTaskController,
} from '../controllers/userTask.controller';
import { upload } from '../configs/upload.config';
import { uploadToCloudinary } from '../middlewares/upload.middleware';

const userTaskRouter = Router({ mergeParams: true }); // Permitir el uso de parametros de rutas padres

userTaskRouter.post(
  '/',
  authRequired,
  upload,
  uploadToCloudinary,
  verifyUserRequired,
  validateSchema(createTaskSchema),
  createTaskController
);
userTaskRouter.put(
  '/:taskId',
  authRequired,
  upload,
  uploadToCloudinary,
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
