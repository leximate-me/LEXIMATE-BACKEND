import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user';
import { authRequired } from '../middlewares/validator.token';
import { extractTextFromFileController } from '../controllers/userTools.controller';

const userToolsRouter = Router();

userToolsRouter.post(
  '/extract-text-from-file',
  authRequired,
  verifyUserRequired,
  extractTextFromFileController
);

export { userToolsRouter };
