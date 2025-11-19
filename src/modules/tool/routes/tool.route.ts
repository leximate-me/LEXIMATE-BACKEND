import { FastifyInstance } from 'fastify';
import { verifyUserRequired } from '../../../common/middlewares/user.middleware';
import { authRequired } from '../../../common/middlewares/token.middleware';
import { ToolController } from '../controllers/tool.controller';
import { requireRole } from '../../../common/middlewares/auth.middleware';

export async function toolRouter(fastify: FastifyInstance) {
  const toolController = new ToolController();

  // Middlewares globales para todas las rutas de este router
  fastify.addHook('preHandler', authRequired);
  fastify.addHook('preHandler', verifyUserRequired);
  fastify.addHook('preHandler', requireRole(['admin', 'student', 'teacher']));

  // Extraer texto de imagen
  fastify.get(
    '/extract-text-from-local-url',
    toolController.extractTextFromLocalUrl.bind(toolController)
  );

  // Chatbot
  fastify.post(
    '/chat-bot-response',
    toolController.chatBotResponse.bind(toolController)
  );

  // Obtener markdown
  fastify.get(
    '/get-markdown',
    toolController.getMarkdownUrl.bind(toolController)
  );
}
