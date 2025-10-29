import { Router } from 'express';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { ToolController } from '../tool.controller';
import { requireRole } from '../../../common/middlewares/auth.middleware';

const toolRouter = Router();
const toolController = new ToolController();

toolRouter.use(authRequired);
toolRouter.use(verifyUserRequired);
toolRouter.use(requireRole(['admin', 'student', 'teacher']));

toolRouter.post(
  '/extract-text-from-img',
  toolController.extractTextFromFile.bind(toolController)
);

toolRouter.post(
  '/chat-bot-response',
  toolController.chatBotResponse.bind(toolController)
);

toolRouter.get(
  '/get-markdown',
  toolController.getMarkdownUrl.bind(toolController)
);

export { toolRouter };
