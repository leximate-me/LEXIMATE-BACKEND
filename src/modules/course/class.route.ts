import { Router } from 'express';
import { verifyUserRequired } from '../../common/middlewares/user.middleware';
import { authRequired } from '../../common/middlewares/token.middleware';
import { validateSchema } from '../../common/middlewares/validator.middleware';
import { createCourseSchema, updateCourseSchema } from './course.schema';

import { postRouter } from '../post/post.route';
import { ClassController } from './course.controller';
import { taskRouter } from '../task/task.route';

const classRouter = Router();
const classController = new ClassController();

classRouter.post(
  '/',
  authRequired,
  verifyUserRequired,
  validateSchema(createCourseSchema),
  classController.create.bind(classController)
);
classRouter.post(
  '/join',
  authRequired,
  verifyUserRequired,
  classController.join.bind(classController)
);
classRouter.post(
  '/:classId/leave',
  authRequired,
  verifyUserRequired,
  classController.leave.bind(classController)
);
classRouter.get(
  '/user',
  authRequired,
  verifyUserRequired,
  classController.getClassesByUser.bind(classController)
);
classRouter.get(
  '/:classId/user',
  authRequired,
  verifyUserRequired,
  classController.getUsersByClass.bind(classController)
);
classRouter.put(
  '/:classId',
  authRequired,
  verifyUserRequired,
  validateSchema(updateCourseSchema),
  classController.update.bind(classController)
);
classRouter.delete(
  '/:classId',
  authRequired,
  verifyUserRequired,
  classController.delete.bind(classController)
);

classRouter.use('/:classId/task', taskRouter);
classRouter.use('/:classId/post', postRouter);

export { classRouter };
