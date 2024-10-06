import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/validator.user.js';
import { authRequired } from '../middlewares/validator.token.js';
import { extractTextFromFileController } from '../controllers/userTools.controller.js';

const userToolsRouter = Router();

userToolsRouter.post(
  '/extract-text-from-file',
  authRequired,
  verifyUserRequired,
  extractTextFromFileController
);

export { userToolsRouter };
