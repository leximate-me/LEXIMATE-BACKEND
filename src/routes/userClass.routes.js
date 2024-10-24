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
  '/leave/:classId',
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
  '/user/:classId',
  authRequired,
  verifyUserRequired,
  getUsersByClassController
);
userClassRouter.put(
  '/:classId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateClassSchema),
  updateClassController
);
userClassRouter.delete(
  '/:classId',
  authRequired,
  verifyUserRequired,
  deleteClassController
);

userClassRouter.use('/:classId/task', userTaskRouter);

export { userClassRouter };
