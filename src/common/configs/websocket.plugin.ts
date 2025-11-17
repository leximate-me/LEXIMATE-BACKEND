import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { NotificationService } from '../services/notification.service';
import { authRequired } from '@common/middlewares/token.middleware';

export async function setupWebSocket(
  fastify: FastifyInstance,
  notificationService: NotificationService
) {
  await fastify.register(fastifyWebsocket);

  fastify.get(
    '/api/notifications',
    {
      websocket: true,
      preHandler: [authRequired],
    },
    (socket, req: FastifyRequest) => {
      const userId = (req as any).user?.id;

      if (!userId) {
        socket.send(JSON.stringify({ type: 'error', message: 'Unauthorized' }));
        socket.close();
        return;
      }

      notificationService.registerUserConnection(userId, socket);

      socket.send(
        JSON.stringify({
          type: 'connected',
          userId,
        })
      );

      socket.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);

          switch (data.type) {
            case 'get_notifications':
              const notifications = await notificationService.getNotifications(
                userId,
                data.limit || 50
              );
              socket.send(
                JSON.stringify({ type: 'notifications', data: notifications })
              );
              break;

            case 'mark_as_read':
              await notificationService.markAsRead(userId, data.notificationId);
              socket.send(
                JSON.stringify({
                  type: 'marked_as_read',
                  notificationId: data.notificationId,
                })
              );
              break;

            case 'get_unread_count':
              const unreadCount = await notificationService.getUnreadCount(
                userId
              );
              socket.send(
                JSON.stringify({ type: 'unread_count', count: unreadCount })
              );
              break;

            case 'ping':
              socket.send(JSON.stringify({ type: 'pong' }));
              break;
          }
        } catch (error) {
          socket.send(
            JSON.stringify({ type: 'error', message: 'Invalid message' })
          );
        }
      });

      socket.on('close', () => {
        notificationService.unregisterUserConnection(userId, socket);
      });

      socket.on('error', () => {
        notificationService.unregisterUserConnection(userId, socket);
      });
    }
  );
}
