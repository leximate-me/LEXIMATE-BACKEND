import { Router } from 'express';
import {
  loginStudent,
  registerStudent,
  getStudentProfile,
  verifyStudentToken,
  logoutStudent,
} from '../controllers/studentAuth.controller.js';
import { authRequired } from '../middlewares/validator.token.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  registerStudentSchema,
  loginStudentSchema,
} from '../schemas/studentAuth.scheams.js';

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
studentAuthRouter.get('/logout', authRequired, logoutStudent);

export { studentAuthRouter };
