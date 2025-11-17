export interface RedisNotification {
  id?: string;
  userId: string;
  type: 'task' | 'post' | 'comment' | 'submission' | 'grade' | 'general';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt?: Date;
}

export class RedisNotificationService {
  private static instance: RedisNotificationService | null = null;
  private redisClient: any;
  private connectedUsers: Map<string, Set<any>> = new Map();
  private readonly MAX_NOTIFICATIONS = 100;
  private readonly NOTIFICATION_TTL = 7 * 24 * 60 * 60;

  private constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  public static getInstance(redisClient?: any): RedisNotificationService {
    if (!RedisNotificationService.instance) {
      if (!redisClient) {
        throw new Error(
          'redisClient requerido para inicializar RedisNotificationService'
        );
      }
      RedisNotificationService.instance = new RedisNotificationService(
        redisClient
      );
    }
    return RedisNotificationService.instance;
  }

  public static reset(): void {
    RedisNotificationService.instance = null;
  }

  registerUserConnection(userId: string, socket: any) {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)?.add(socket);
  }

  unregisterUserConnection(userId: string, socket: any) {
    if (this.connectedUsers.has(userId)) {
      const sockets = this.connectedUsers.get(userId);
      if (sockets) {
        sockets.delete(socket);
        if (sockets.size === 0) {
          this.connectedUsers.delete(userId);
        }
      }
    }
  }

  async notifyUser(notification: RedisNotification) {
    const key = `notifications:${notification.userId}`;
    const notificationWithId = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      try {
        if (typeof this.redisClient.lpush === 'function') {
          await this.redisClient.lpush(key, JSON.stringify(notificationWithId));
        } else if (typeof this.redisClient.lPush === 'function') {
          await this.redisClient.lPush(key, JSON.stringify(notificationWithId));
        } else {
          await this.redisClient.call(
            'LPUSH',
            key,
            JSON.stringify(notificationWithId)
          );
        }

        if (typeof this.redisClient.ltrim === 'function') {
          await this.redisClient.ltrim(key, 0, this.MAX_NOTIFICATIONS - 1);
        } else if (typeof this.redisClient.lTrim === 'function') {
          await this.redisClient.lTrim(key, 0, this.MAX_NOTIFICATIONS - 1);
        } else {
          await this.redisClient.call(
            'LTRIM',
            key,
            0,
            this.MAX_NOTIFICATIONS - 1
          );
        }

        if (typeof this.redisClient.expire === 'function') {
          await this.redisClient.expire(key, this.NOTIFICATION_TTL);
        } else {
          await this.redisClient.call('EXPIRE', key, this.NOTIFICATION_TTL);
        }
      } catch (error) {
        // Silenciosamente ignora errores de Redis
      }

      await this.broadcastToUser(notification.userId, {
        type: 'notification',
        data: notificationWithId,
      });
    } catch (error) {
      console.error(`Error notificando usuario ${notification.userId}:`, error);
    }
  }

  async notifyUsers(
    userIds: string[],
    notification: Omit<RedisNotification, 'userId'>
  ) {
    const promises = userIds.map((userId) =>
      this.notifyUser({
        ...notification,
        userId,
      })
    );
    await Promise.all(promises);
  }

  async getNotifications(userId: string, limit: number = 50) {
    try {
      const key = `notifications:${userId}`;
      let notifications: any[] = [];

      try {
        if (typeof this.redisClient.lrange === 'function') {
          notifications = await this.redisClient.lrange(
            key,
            0,
            Math.min(limit, this.MAX_NOTIFICATIONS) - 1
          );
        } else if (typeof this.redisClient.lRange === 'function') {
          notifications = await this.redisClient.lRange(
            key,
            0,
            Math.min(limit, this.MAX_NOTIFICATIONS) - 1
          );
        } else {
          notifications = await this.redisClient.call(
            'LRANGE',
            key,
            0,
            Math.min(limit, this.MAX_NOTIFICATIONS) - 1
          );
        }
      } catch (error) {
        return [];
      }

      return (notifications || [])
        .map((n: string) => {
          try {
            return JSON.parse(n);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  async markAsRead(userId: string, notificationId: string) {
    try {
      const key = `notifications:${userId}`;
      let notifications: any[] = [];

      try {
        if (typeof this.redisClient.lrange === 'function') {
          notifications = await this.redisClient.lrange(key, 0, -1);
        } else if (typeof this.redisClient.lRange === 'function') {
          notifications = await this.redisClient.lRange(key, 0, -1);
        } else {
          notifications = await this.redisClient.call('LRANGE', key, 0, -1);
        }
      } catch (error) {
        return;
      }

      const updated = (notifications || []).map((n: string) => {
        const notification = JSON.parse(n);
        if (notification.id === notificationId) {
          notification.read = true;
        }
        return JSON.stringify(notification);
      });

      if (updated.length > 0) {
        try {
          if (typeof this.redisClient.del === 'function') {
            await this.redisClient.del(key);
          } else {
            await this.redisClient.call('DEL', key);
          }

          if (typeof this.redisClient.rpush === 'function') {
            await this.redisClient.rpush(key, ...updated);
          } else if (typeof this.redisClient.rPush === 'function') {
            await this.redisClient.rPush(key, ...updated);
          } else {
            await this.redisClient.call('RPUSH', key, ...updated);
          }

          if (typeof this.redisClient.expire === 'function') {
            await this.redisClient.expire(key, this.NOTIFICATION_TTL);
          } else {
            await this.redisClient.call('EXPIRE', key, this.NOTIFICATION_TTL);
          }
        } catch (error) {
          // Ignorar errores de Redis
        }
      }

      await this.broadcastToUser(userId, {
        type: 'marked_as_read',
        notificationId,
      });
    } catch (error) {
      console.error(`Error marcando notificación como leída:`, error);
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const key = `notifications:${userId}`;
      let notifications: any[] = [];

      try {
        if (typeof this.redisClient.lrange === 'function') {
          notifications = await this.redisClient.lrange(key, 0, -1);
        } else if (typeof this.redisClient.lRange === 'function') {
          notifications = await this.redisClient.lRange(key, 0, -1);
        } else {
          notifications = await this.redisClient.call('LRANGE', key, 0, -1);
        }
      } catch (error) {
        return;
      }

      const updated = (notifications || []).map((n: string) => {
        const notification = JSON.parse(n);
        notification.read = true;
        return JSON.stringify(notification);
      });

      if (updated.length > 0) {
        try {
          if (typeof this.redisClient.del === 'function') {
            await this.redisClient.del(key);
          } else {
            await this.redisClient.call('DEL', key);
          }

          if (typeof this.redisClient.rpush === 'function') {
            await this.redisClient.rpush(key, ...updated);
          } else if (typeof this.redisClient.rPush === 'function') {
            await this.redisClient.rPush(key, ...updated);
          } else {
            await this.redisClient.call('RPUSH', key, ...updated);
          }

          if (typeof this.redisClient.expire === 'function') {
            await this.redisClient.expire(key, this.NOTIFICATION_TTL);
          } else {
            await this.redisClient.call('EXPIRE', key, this.NOTIFICATION_TTL);
          }
        } catch (error) {
          // Ignorar errores de Redis
        }
      }

      await this.broadcastToUser(userId, {
        type: 'all_marked_as_read',
      });
    } catch (error) {
      console.error(
        `Error marcando todas las notificaciones como leídas:`,
        error
      );
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const notifications = await this.getNotifications(
        userId,
        this.MAX_NOTIFICATIONS
      );
      return notifications.filter((n) => !n.read).length;
    } catch (error) {
      return 0;
    }
  }

  async deleteNotification(userId: string, notificationId: string) {
    try {
      const key = `notifications:${userId}`;
      let notifications: any[] = [];

      try {
        if (typeof this.redisClient.lrange === 'function') {
          notifications = await this.redisClient.lrange(key, 0, -1);
        } else if (typeof this.redisClient.lRange === 'function') {
          notifications = await this.redisClient.lRange(key, 0, -1);
        } else {
          notifications = await this.redisClient.call('LRANGE', key, 0, -1);
        }
      } catch (error) {
        return;
      }

      const updated = (notifications || []).filter((n: string) => {
        const notification = JSON.parse(n);
        return notification.id !== notificationId;
      });

      try {
        if (typeof this.redisClient.del === 'function') {
          await this.redisClient.del(key);
        } else {
          await this.redisClient.call('DEL', key);
        }

        if (updated.length > 0) {
          if (typeof this.redisClient.rpush === 'function') {
            await this.redisClient.rpush(key, ...updated);
          } else if (typeof this.redisClient.rPush === 'function') {
            await this.redisClient.rPush(key, ...updated);
          } else {
            await this.redisClient.call('RPUSH', key, ...updated);
          }

          if (typeof this.redisClient.expire === 'function') {
            await this.redisClient.expire(key, this.NOTIFICATION_TTL);
          } else {
            await this.redisClient.call('EXPIRE', key, this.NOTIFICATION_TTL);
          }
        }
      } catch (error) {
        // Ignorar errores de Redis
      }

      await this.broadcastToUser(userId, {
        type: 'notification_deleted',
        notificationId,
      });
    } catch (error) {
      console.error(`Error eliminando notificación:`, error);
    }
  }

  async clearNotifications(userId: string) {
    try {
      const key = `notifications:${userId}`;
      try {
        if (typeof this.redisClient.del === 'function') {
          await this.redisClient.del(key);
        } else {
          await this.redisClient.call('DEL', key);
        }
      } catch (error) {
        // Ignorar errores de Redis
      }

      await this.broadcastToUser(userId, {
        type: 'notifications_cleared',
      });
    } catch (error) {
      console.error(`Error limpiando notificaciones:`, error);
    }
  }

  private async broadcastToUser(userId: string, message: any) {
    if (this.connectedUsers.has(userId)) {
      const sockets = this.connectedUsers.get(userId);
      if (sockets && sockets.size > 0) {
        const messageStr = JSON.stringify(message);
        sockets.forEach((socket: any) => {
          try {
            if (socket.readyState === 1) {
              socket.send(messageStr);
            }
          } catch (error) {
            // Ignorar errores de socket
          }
        });
      }
    }
  }

  getConnectionStats() {
    const stats = {
      totalUsers: this.connectedUsers.size,
      totalConnections: 0,
      users: [] as { userId: string; connections: number }[],
    };

    this.connectedUsers.forEach((sockets, userId) => {
      const connectionCount = sockets.size;
      stats.totalConnections += connectionCount;
      stats.users.push({ userId, connections: connectionCount });
    });

    return stats;
  }
}
