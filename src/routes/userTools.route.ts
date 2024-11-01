import { Router } from 'express';
import { verifyUserRequired } from '../middlewares/user.middleware';
import { authRequired } from '../middlewares/token.middleware';
import { extractTextFromFileController } from '../controllers/userTools.controller';
import { upload } from '../configs/upload.config';

const userToolsRouter = Router();

userToolsRouter.post(
  '/extract-text-from-file',
  authRequired,
  upload,
  verifyUserRequired,
  extractTextFromFileController
);

export { userToolsRouter };
