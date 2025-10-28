import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { validateSchema } from '../../../common/middlewares/validator-schema.middleware';
import { createTaskSchema, updateTaskSchema } from '../task.schema';
import { upload } from '../../../common/configs/upload.config';
import { uploadToCloudinary } from '../../../common/middlewares/upload.middleware';
import { TaskController } from '../task.controller';

const taskRouter = Router({ mergeParams: true });
const taskController = new TaskController();

taskRouter.post(
  '/',
  authRequired,
  upload,
  uploadToCloudinary,
  verifyUserRequired,
  validateSchema(createTaskSchema),
  taskController.create.bind(taskController)
);
taskRouter.put(
  '/:taskId',
  authRequired,
  upload,
  uploadToCloudinary,
  verifyUserRequired,
  validateSchema(updateTaskSchema),
  taskController.update.bind(taskController)
);
taskRouter.delete(
  '/:taskId',
  authRequired,
  verifyUserRequired,
  taskController.delete.bind(taskController)
);
taskRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  taskController.getAllByClass.bind(taskController)
);
taskRouter.get(
  '/:taskId',
  authRequired,
  verifyUserRequired,
  taskController.getOne.bind(taskController)
);

export { taskRouter };
