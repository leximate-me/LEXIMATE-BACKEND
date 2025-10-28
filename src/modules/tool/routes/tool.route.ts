import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { ToolController } from '../tool.controller';

const toolRouter = Router();
const toolController = new ToolController();

toolRouter.post(
  '/extract-text-from-img',
  authRequired,
  verifyUserRequired,
  toolController.extractTextFromFile.bind(toolController)
);

export { toolRouter };
