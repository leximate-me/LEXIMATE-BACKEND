import { FastifyInstance } from 'fastify';
import { ChatController } from '@chat/controllers/chat.controller';
import { authRequired } from '@common/middlewares/token.middleware';

export async function chatRouter(fastify: FastifyInstance) {
  const controller = new ChatController();

  fastify.post(
    '/',
    {
      preHandler: [authRequired],
    },
    controller.createChat.bind(controller)
  );

  fastify.get(
    '/',
    {
      preHandler: [authRequired],
    },
    controller.getUserChats.bind(controller)
  );

  fastify.get(
    '/:chatId/messages',
    {
      preHandler: [authRequired],
    },
    controller.getChatMessages.bind(controller)
  );

  fastify.post(
    '/:chatId/messages',
    {
      preHandler: [authRequired],
    },
    controller.sendMessage.bind(controller)
  );

  fastify.get(
    '/:chatId',
    {
      preHandler: [authRequired],
    },
    controller.getChatById.bind(controller)
  );
}
