import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';
import {
  createClassController,
  joinClassController,
  leaveClassController,
  getClassesByUserController,
  getUsersByClassController,
  updateClassController,
  deleteClassController,
} from '../controllers/userClass.controller.js';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  createClassSchema,
  updateClassSchema,
} from '../schemas/class.schema.js';

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
  '/leave',
  authRequired,
  verifyUserRequired,
  leaveClassController
);
userClassRouter.get(
  '/',
  authRequired,
  verifyUserRequired,
  getClassesByUserController
);
userClassRouter.get(
  '/users/:classCode',
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

export { userClassRouter };
