import { Router } from 'express';
import { authRequired } from '../middlewares/validator.token.js';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/class.controller.js';

const classRouter = Router();

classRouter.post('/', authRequired, createClass);
classRouter.get('/', authRequired, getClasses);
classRouter.put('/:classId', authRequired, updateClass);
classRouter.delete('/:classId', authRequired, deleteClass);

export { classRouter };
