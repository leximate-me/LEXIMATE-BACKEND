import { Router } from 'express';
import { verifyUserRequired } from '../../common/middlewares/user.middleware';
import { authRequired } from '../../common/middlewares/token.middleware';
import { validateSchema } from '../../common/middlewares/validator.middleware';
import { createCourseSchema, updateCourseSchema } from './course.schema';

import { postRouter } from '../post/post.route';
import { CourseController } from './course.controller';
import { taskRouter } from '../task/task.route';

const classRouter = Router();

const courseController = new CourseController();

classRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createCourseSchema),
  courseController.create.bind(courseController)
);
classRouter.post(
  '/join',
  authRequired,
  verifyUserRequired,
  courseController.join.bind(courseController)
);
classRouter.post(
  '/:classId/leave',
  authRequired,
  verifyUserRequired,
  courseController.leave.bind(courseController)
);
classRouter.get(
  '/user',
  authRequired,
  verifyUserRequired,
  courseController.getClassesByUser.bind(courseController)
);
classRouter.get(
  '/:classId/user',
  authRequired,
  verifyUserRequired,
  courseController.getUsersByClass.bind(courseController)
);
classRouter.put(
  '/:classId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateCourseSchema),
  courseController.update.bind(courseController)
);
classRouter.delete(
  '/:classId',
  authRequired,
  verifyUserRequired,
  courseController.delete.bind(courseController)
);

classRouter.use('/:classId/task', taskRouter);
classRouter.use('/:classId/post', postRouter);

export { classRouter };
