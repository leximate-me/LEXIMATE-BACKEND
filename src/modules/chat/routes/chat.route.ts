import { FastifyInstance } from 'fastify';
import { ChatController } from '@chat/controllers/chat.controller';
import { authRequired } from '@common/middlewares/token.middleware';
import { createChatSchema, sendMessageSchema } from '@chat/schemas';

export async function chatRouter(fastify: FastifyInstance) {
  const controller = new ChatController();

  fastify.post(
    '/',
    {
      preHandler: [authRequired],
      schema: createChatSchema,
    },
    controller.createChat.bind(controller)
  );

  fastify.get(
    '/user-chats',
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
      schema: sendMessageSchema,
    },
    controller.sendMessage.bind(controller)
  );

  fastify.patch(
    '/:chatId/read',
    {
      preHandler: [authRequired],
    },
    controller.markChatAsRead.bind(controller)
  );

  fastify.get(
    '/:chatId',
    {
      preHandler: [authRequired],
    },
    controller.getChatById.bind(controller)
  );
}
