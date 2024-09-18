import { Router } from 'express';
import {
  loginStudent,
  registerStudent,
  verifyStudentToken,
  logoutStudent,
  getStudentProfile,
} from '../controllers/studentAuth.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  registerStudentSchema,
  loginStudentSchema,
} from '../schemas/student.schemas.js';

const studentAuthRouter = Router();

studentAuthRouter.post(
  '/register',
  validateSchema(registerStudentSchema),
  registerStudent
);
studentAuthRouter.post(
  '/login',
  validateSchema(loginStudentSchema),
  loginStudent
);
studentAuthRouter.get('/profile', authRequired, getStudentProfile);
studentAuthRouter.get('/verify-token', verifyStudentToken);
studentAuthRouter.post('/logout', authRequired, logoutStudent);

export { studentAuthRouter };
