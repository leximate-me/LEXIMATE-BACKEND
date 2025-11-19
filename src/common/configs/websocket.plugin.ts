import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyWebsocket, { WebSocket } from '@fastify/websocket';
import { ChatService } from '@modules/chat/services/chat.service';
import { authRequired } from '@common/middlewares/token.middleware';
import { chatEventEmitter } from '@common/events/chat.events';
import { notificationEmitter } from '@common/events/notification.events';

const userConnections = new Map<string, Set<WebSocket>>();

export async function setupWebSocket(
  fastify: FastifyInstance,
  chatService: ChatService
) {
  await fastify.register(fastifyWebsocket);

  fastify.get(
    '/api/ws',
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

      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId)?.add(socket);

      socket.send(
        JSON.stringify({
          type: 'connected',
          userId,
          timestamp: new Date().toISOString(),
        })
      );

      socket.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message.toString());

          switch (data.type) {
            case 'ping':
              socket.send(JSON.stringify({ type: 'pong' }));
              break;
            
            default:
              
              break;
          }
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      });

      socket.on('close', () => {
        if (userConnections.has(userId)) {
          userConnections.get(userId)?.delete(socket);
          if (userConnections.get(userId)?.size === 0) {
            userConnections.delete(userId);
          }
        }
      });

      socket.on('error', (err) => {
        console.error('WebSocket error:', err);
        if (userConnections.has(userId)) {
          userConnections.get(userId)?.delete(socket);
        }
      });
    }
  );

  chatEventEmitter.removeAllListeners('new_message');
  
  chatEventEmitter.on('new_message', async (message: any) => {
    try {
      const chat = await chatService.getChatById(message.chatId);
      if (chat) {
        chat.users.forEach((u) => {
          const connections = userConnections.get(u.id);
          if (connections) {
            connections.forEach((client) => {
              if (client.readyState === 1) { // OPEN
                client.send(
                  JSON.stringify({
                    type: 'chat_message',
                    data: message,
                  })
                );
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error broadcasting chat message:', error);
    }
  });

  notificationEmitter.removeAllListeners('notification_created');
  
  notificationEmitter.on('notification_created', (notification: any) => {
    try {
      const connections = userConnections.get(notification.userId);
      if (connections) {
        connections.forEach((client) => {
          if (client.readyState === 1) { // OPEN
            client.send(
              JSON.stringify({
                type: 'notification',
                data: notification,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  });
}
