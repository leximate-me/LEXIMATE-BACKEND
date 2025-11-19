import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyWebsocket, { WebSocket } from '@fastify/websocket';
import { ChatService } from '@modules/chat/services/chat.service';
import { authRequired } from '@common/middlewares/token.middleware';
import { chatEventEmitter } from '@common/events/chat.events';
import { notificationEmitter } from '@common/events/notification.events';
import { postEventEmitter } from '@common/events/post.events';
import { commentEventEmitter } from '@common/events/comment.events';
import { courseEventEmitter } from '@common/events/course.events';
import { taskEventEmitter } from '@common/events/task.events';

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

  // Post events for real-time updates
  postEventEmitter.removeAllListeners('post_created');
  postEventEmitter.removeAllListeners('post_updated');
  postEventEmitter.removeAllListeners('post_deleted');

  postEventEmitter.on('post_created', (payload: any) => {
    try {
      // Broadcast to all users in the course
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) { // OPEN
              client.send(
                JSON.stringify({
                  type: 'post_created',
                  data: payload.post,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting post creation:', error);
    }
  });

  postEventEmitter.on('post_updated', (payload: any) => {
    try {
      // Broadcast to all users in the course
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) { // OPEN
              client.send(
                JSON.stringify({
                  type: 'post_updated',
                  data: payload.post,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting post update:', error);
    }
  });

  postEventEmitter.on('post_deleted', (payload: any) => {
    try {
      // Broadcast to all users in the course
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) { // OPEN
              client.send(
                JSON.stringify({
                  type: 'post_deleted',
                  data: { postId: payload.postId, courseId: payload.courseId },
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting post deletion:', error);
    }
  });

  // Comment events for real-time updates
  commentEventEmitter.removeAllListeners('comment_created');
  commentEventEmitter.removeAllListeners('comment_updated');
  commentEventEmitter.removeAllListeners('comment_deleted');

  commentEventEmitter.on('comment_created', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'comment_created',
                  data: payload.comment,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting comment creation:', error);
    }
  });

  commentEventEmitter.on('comment_updated', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'comment_updated',
                  data: payload.comment,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting comment update:', error);
    }
  });

  commentEventEmitter.on('comment_deleted', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'comment_deleted',
                  data: { commentId: payload.commentId, postId: payload.postId },
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting comment deletion:', error);
    }
  });

  // Course events for real-time updates
  courseEventEmitter.removeAllListeners('course_created');
  courseEventEmitter.removeAllListeners('course_updated');
  courseEventEmitter.removeAllListeners('course_deleted');

  courseEventEmitter.on('course_created', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'course_created',
                  data: payload.course,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting course creation:', error);
    }
  });

  courseEventEmitter.on('course_updated', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'course_updated',
                  data: payload.course,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting course update:', error);
    }
  });

  courseEventEmitter.on('course_deleted', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'course_deleted',
                  data: { courseId: payload.courseId },
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting course deletion:', error);
    }
  });

  // Task events for real-time updates
  taskEventEmitter.removeAllListeners('task_created');
  taskEventEmitter.removeAllListeners('task_updated');
  taskEventEmitter.removeAllListeners('task_deleted');
  taskEventEmitter.removeAllListeners('task_assigned');
  taskEventEmitter.removeAllListeners('task_submitted');

  taskEventEmitter.on('task_created', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'task_created',
                  data: payload.task,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting task creation:', error);
    }
  });

  taskEventEmitter.on('task_updated', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'task_updated',
                  data: payload.task,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting task update:', error);
    }
  });

  taskEventEmitter.on('task_deleted', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'task_deleted',
                  data: { taskId: payload.taskId, courseId: payload.courseId },
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting task deletion:', error);
    }
  });

  taskEventEmitter.on('task_assigned', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'task_assigned',
                  data: payload.task,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting task assignment:', error);
    }
  });

  taskEventEmitter.on('task_submitted', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'task_submitted',
                  data: payload.submission,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting task submission:', error);
    }
  });

  taskEventEmitter.on('submission_qualified', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'submission_qualified',
                  data: payload.submission,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting submission qualification:', error);
    }
  });

  taskEventEmitter.on('submission_updated', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'submission_updated',
                  data: payload.submission,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting submission update:', error);
    }
  });

  taskEventEmitter.on('submission_deleted', (payload: any) => {
    try {
      payload.userIds.forEach((userId: string) => {
        const connections = userConnections.get(userId);
        if (connections) {
          connections.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: 'submission_deleted',
                  data: { submissionId: payload.submissionId, taskId: payload.taskId },
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting submission deletion:', error);
    }
  });
}
