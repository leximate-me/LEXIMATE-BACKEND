  import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  createClassSchema,
  updateClassSchema,
} from '../schemas/class.schema.js';
import {
  createClassController,
  joinClassController,
  leaveClassController,
  getClassesByUserController,
  getUsersByClassController,
  updateClassController,
  deleteClassController,
} from '../controllers/userClass.controller.js';
import { userTaskRouter } from './userTask.routes.js';

const userClassRouter = Router();

userClassRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createClassSchema),
  createClassController
);
userClassRouter.post(
  '/join',
  authRequired,
  verifyUserRequired,
  joinClassController
);
userClassRouter.post(
  '/leave/:classCode',
  authRequired,
  verifyUserRequired,
  leaveClassController
);
userClassRouter.get(
  '/user',
  authRequired,
  verifyUserRequired,
  getClassesByUserController
);
userClassRouter.get(
  '/:classCode/user',
  authRequired,
  verifyUserRequired,
  getUsersByClassController
);
userClassRouter.put(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  validateSchema(updateClassSchema),
  updateClassController
);
userClassRouter.delete(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  deleteClassController
);

userClassRouter.use('/:classCode/tasks', userTaskRouter);

export { userClassRouter };
