import { Router } from 'express';
import {
  loginTeacher,
  registerTeacher,
  logoutTeacher,
  getTeacherProfile,
  verifyTeacherToken,
  generateStudentToken,
} from '../controllers/teacherAuth.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  loginTeacherSchema,
  registerTeacherSchema,
} from '../schemas/teacherAuth.schemas.js';

const teacherAuthRouter = Router();

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
teacherAuthRouter.post('/logout', logoutTeacher);
teacherAuthRouter.get('/profile', authRequired, getTeacherProfile);
teacherAuthRouter.get('/verify-token', verifyTeacherToken);
teacherAuthRouter.post(
  '/generate-student-token',
  authRequired,
  generateStudentToken
);

export { teacherAuthRouter };
