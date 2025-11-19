import { FastifyInstance } from 'fastify';
import { NotificationController } from '@notification/controllers/notification.controller';
import { authRequired } from '@common/middlewares/token.middleware';
import { 
  getUserNotificationsSchema, 
  notificationIdSchema 
} from '@notification/schemas';

export async function notificationRouter(fastify: FastifyInstance) {
  const controller = new NotificationController();

  fastify.get(
    '/',
    {
      preHandler: [authRequired],
      schema: getUserNotificationsSchema,
    },
    controller.getUserNotifications.bind(controller)
  );

  fastify.get(
    '/unread-count',
    {
      preHandler: [authRequired],
    },
    controller.getUnreadCount.bind(controller)
  );

  fastify.patch(
    '/mark-all-read',
    {
      preHandler: [authRequired],
    },
    controller.markAllAsRead.bind(controller)
  );

  fastify.patch(
    '/:id/read',
    {
      preHandler: [authRequired],
      schema: notificationIdSchema,
    },
    controller.markAsRead.bind(controller)
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authRequired],
      schema: notificationIdSchema,
    },
    controller.deleteNotification.bind(controller)
  );
}
