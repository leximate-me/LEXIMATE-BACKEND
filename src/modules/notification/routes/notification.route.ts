import { FastifyInstance } from 'fastify';
import { NotificationController } from '@notification/notification.controller';
import { authRequired } from '@common/middlewares/token.middleware';

export async function notificationRouter(fastify: FastifyInstance) {
  const controller = new NotificationController();

  // Obtener notificaciones recientes
  fastify.get(
    '/',
    { preHandler: [authRequired] },
    controller.getNotifications.bind(controller)
  );

  // Obtener historial completo
  fastify.get(
    '/history',
    { preHandler: [authRequired] },
    controller.getNotificationHistory.bind(controller)
  );

  // Obtener todas las notificaciones
  fastify.get(
    '/all',
    { preHandler: [authRequired] },
    controller.getAllNotifications.bind(controller)
  );

  // Obtener solo las no leídas
  fastify.get(
    '/unread',
    { preHandler: [authRequired] },
    controller.getUnreadNotifications.bind(controller)
  );

  // Obtener contador de no leídas
  fastify.get(
    '/unread/count',
    { preHandler: [authRequired] },
    controller.getUnreadCount.bind(controller)
  );

  // Obtener estadísticas de conexión
  fastify.get(
    '/stats',
    { preHandler: [authRequired] },
    controller.getConnectionStats.bind(controller)
  );

  // Marcar una como leída
  fastify.patch(
    '/:notificationId/read',
    { preHandler: [authRequired] },
    controller.markAsRead.bind(controller)
  );

  // Marcar todas como leídas
  fastify.patch(
    '/read/all',
    { preHandler: [authRequired] },
    controller.markAllAsRead.bind(controller)
  );

  // Eliminar una notificación
  fastify.delete(
    '/:notificationId',
    { preHandler: [authRequired] },
    controller.deleteNotification.bind(controller)
  );

  // Limpiar todas las notificaciones
  fastify.delete(
    '/',
    { preHandler: [authRequired] },
    controller.clearNotifications.bind(controller)
  );

  // Sincronizar Redis a BD
  fastify.post(
    '/sync',
    { preHandler: [authRequired] },
    controller.syncRedisToDatabase.bind(controller)
  );
}
