import { Router } from 'express';
import {
  registerTeacher,
  loginTeacher,
  getTeacherProfile,
  logoutTeacher,
  verifyToken,
  generateToken,
} from '../controllers/teacherAuthController.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  registerTeacherSchema,
  loginTeacherSchema,
} from '../schemas/teacher.schema.js';

const teacherAuthRouter = Router();

teacherAuthRouter.get('/profile', authRequired, getTeacherProfile);
teacherAuthRouter.post(
  '/register',
  validateSchema(registerTeacherSchema),
  registerTeacher
);
teacherAuthRouter.post(
  '/login',
  validateSchema(loginTeacherSchema),
  loginTeacher
);
teacherAuthRouter.post('/logout', authRequired, logoutTeacher);
teacherAuthRouter.get('/verify-token', verifyToken);
teacherAuthRouter.post('/generate-token', authRequired, generateToken);

export { teacherAuthRouter };
