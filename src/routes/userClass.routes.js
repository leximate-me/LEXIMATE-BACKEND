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

const userClassRouter = Router();

userClassRouter.post('/', authRequired, createClassController);
userClassRouter.post('/join/:classCode', authRequired, joinClassController);
userClassRouter.post('/leave', authRequired, leaveClassController);
userClassRouter.get('/', authRequired, getClassesByUserController);
userClassRouter.get(
  '/users/:classCode',
  authRequired,
  getUsersByClassController
);
userClassRouter.put('/:classCode', authRequired, updateClassController);
userClassRouter.delete('/:classCode', authRequired, deleteClassController);

export { userClassRouter };
