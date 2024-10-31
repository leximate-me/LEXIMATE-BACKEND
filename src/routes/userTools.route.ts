import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import { extractTextFromFileController } from '../controllers/userTools.controller';

const userToolsRouter = Router();

userToolsRouter.post(
  '/extract-text-from-file',
  authRequired,
  verifyUserRequired,
  extractTextFromFileController
);

export { userToolsRouter };
