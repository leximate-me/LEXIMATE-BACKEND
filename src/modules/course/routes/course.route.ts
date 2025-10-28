import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { validateSchema } from '../../../common/middlewares/validator-schema.middleware';
import { createCourseSchema, updateCourseSchema } from '../course.schema';
import { requireRole } from '../../../common/middlewares/auth.middleware';

import { postRouter } from '../../post/routes/post.route';
import { CourseController } from '../course.controller';
import { taskRouter } from '../../task/routes/task.route';

const courseRouter = Router();

const courseController = new CourseController();

courseRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  requireRole(['admin', 'teacher']),
  validateSchema(createCourseSchema),
  courseController.create.bind(courseController)
);
courseRouter.post(
  '/join',
  authRequired,
  verifyUserRequired,
  requireRole(['student']),
  courseController.join.bind(courseController)
);
courseRouter.post(
  '/:courseId/leave',
  authRequired,
  verifyUserRequired,
  requireRole(['student']),
  courseController.leave.bind(courseController)
);
courseRouter.get(
  '/user',
  authRequired,
  verifyUserRequired,
  courseController.getClassesByUser.bind(courseController)
);
courseRouter.get(
  '/:courseId/user',
  authRequired,
  verifyUserRequired,
  courseController.getUsersByClass.bind(courseController)
);
courseRouter.put(
  '/:courseId',
  authRequired,
  verifyUserRequired,
  requireRole(['admin', 'teacher']),
  validateSchema(updateCourseSchema),
  courseController.update.bind(courseController)
);
courseRouter.delete(
  '/:courseId',
  authRequired,
  verifyUserRequired,
  requireRole(['admin', 'teacher']),
  courseController.delete.bind(courseController)
);

courseRouter.use('/:courseId/task', taskRouter);
courseRouter.use('/:courseId/post', postRouter);

export { courseRouter };
