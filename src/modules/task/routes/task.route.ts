import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { upload } from '../../../common/configs/upload.config';
import { uploadToCloudinary } from '../../../common/middlewares/upload.middleware';
import { TaskController } from '../task.controller';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { requireRole } from '../../../common/middlewares/auth.middleware';

const taskRouter = Router({ mergeParams: true });
const taskController = new TaskController();

taskRouter.use(authRequired);
taskRouter.use(verifyUserRequired);
taskRouter.use(requireRole(['teacher', 'admin']));

taskRouter.post(
  '/',
  upload,
  uploadToCloudinary,
  validateDto(CreateTaskDto),
  taskController.create.bind(taskController)
);
taskRouter.put(
  '/:taskId',
  upload,
  uploadToCloudinary,
  validateDto(UpdateTaskDto),
  taskController.update.bind(taskController)
);
taskRouter.delete('/:taskId', taskController.delete.bind(taskController));
taskRouter.get(
  '/',

  taskController.getAllByClass.bind(taskController)
);
taskRouter.get(
  '/:taskId',

  taskController.getOne.bind(taskController)
);

export { taskRouter };
