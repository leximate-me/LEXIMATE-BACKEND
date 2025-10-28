import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { requireRole } from '../../../common/middlewares/auth.middleware';
import { postRouter } from '../../post/routes/post.route';
import { CourseController } from '../course.controller';
import { taskRouter } from '../../task/routes/task.route';
import { validateDto } from '../../../common/middlewares/validator.middleware';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

const courseRouter = Router();

const courseController = new CourseController();

courseRouter.use(authRequired);
courseRouter.use(verifyUserRequired);

courseRouter.post(
  '/',
  requireRole(['admin', 'teacher']),
  validateDto(CreateCourseDto),
  courseController.create.bind(courseController)
);
courseRouter.post(
  '/join',
  requireRole(['student']),
  courseController.join.bind(courseController)
);
courseRouter.post(
  '/:courseId/leave',
  requireRole(['student']),
  courseController.leave.bind(courseController)
);
courseRouter.get(
  '/user',
  courseController.getClassesByUser.bind(courseController)
);
courseRouter.get(
  '/:courseId/user',
  courseController.getUsersByClass.bind(courseController)
);
courseRouter.put(
  '/:courseId',
  requireRole(['admin', 'teacher']),
  validateDto(UpdateCourseDto),
  courseController.update.bind(courseController)
);
courseRouter.delete(
  '/:courseId',
  requireRole(['admin', 'teacher']),
  courseController.delete.bind(courseController)
);

courseRouter.use('/:courseId/task', taskRouter);
courseRouter.use('/:courseId/post', postRouter);

export { courseRouter };
