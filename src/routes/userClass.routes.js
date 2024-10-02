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

const userClassRouter = Router();

userClassRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
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
  updateClassController
);
userClassRouter.delete(
  '/:classCode',
  authRequired,
  verifyUserRequired,
  deleteClassController
);

export { userClassRouter };
