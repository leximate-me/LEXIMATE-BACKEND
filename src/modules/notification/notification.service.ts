import { AppDataSource } from '@database/db';
import { Notification } from '@notification/entities/notification.entity';
import { User } from '@user/entities';
import { RedisNotificationService } from '@common/services/redis-notification.service';
import { HttpError } from '@common/libs/http-error';

export class NotificationService {
  private redisService: RedisNotificationService;
  private notificationRepository = AppDataSource.getRepository(Notification);
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    this.redisService = RedisNotificationService.getInstance();
  }

  /**
   * Gets recent notifications from Redis
   */
  async getRecentNotifications(userId: string, limit: number = 50) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const notifications = await this.redisService.getNotifications(
        userId,
        limit
      );

      return {
        source: 'redis',
        data: notifications,
        total: notifications.length,
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError(
        'Error fetching recent notifications'
      );
    }
  }

  /**
   * Gets complete history from database
   */
  async getNotificationHistory(
    userId: string,
    skip: number = 0,
    take: number = 100
  ) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw HttpError.notFound('User not found');
      }

      const [data, total] = await this.notificationRepository.findAndCount({
        where: { user: { id: userId }, deletedAt: null },
        order: { createdAt: 'DESC' },
        skip,
        take,
      });

      return {
        source: 'database',
        data,
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError(
        'Error fetching notification history'
      );
    }
  }

  /**
   * Gets all notifications (recent + history)
   */
  async getAllNotifications(userId: string, limit: number = 50) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const recent = await this.getRecentNotifications(userId, limit);

      return {
        data: recent.data,
        total: recent.total,
        limit,
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error fetching all notifications');
    }
  }

  /**
   * Gets unread notifications
   */
  async getUnreadNotifications(userId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const notifications = await this.redisService.getNotifications(
        userId,
        100
      );
      const unread = notifications.filter((n) => !n.read);

      return {
        data: unread,
        total: unread.length,
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError(
        'Error fetching unread notifications'
      );
    }
  }

  /**
   * Gets unread notifications count
   */
  async getUnreadCount(userId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const count = await this.redisService.getUnreadCount(userId);

      return { unreadCount: count };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error getting unread count');
    }
  }

  /**
   * Marks a notification as read on both sides
   */
  async markAsRead(userId: string, notificationId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      if (!notificationId) {
        throw HttpError.badRequest('Notification ID is required');
      }

      // In Redis
      await this.redisService.markAsRead(userId, notificationId);

      // In Database
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, user: { id: userId } },
      });

      if (notification) {
        notification.read = true;
        await this.notificationRepository.save(notification);
      }

      return { message: 'Notification marked as read' };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error marking notification as read');
    }
  }

  /**
   * Marks all notifications as read
   */
  async markAllAsRead(userId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      // In Redis
      await this.redisService.markAllAsRead(userId);

      // In Database
      await this.notificationRepository.update(
        { user: { id: userId }, read: false },
        { read: true }
      );

      return { message: 'All notifications marked as read' };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError(
        'Error marking all notifications as read'
      );
    }
  }

  /**
   * Deletes a notification (soft delete)
   */
  async deleteNotification(userId: string, notificationId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      if (!notificationId) {
        throw HttpError.badRequest('Notification ID is required');
      }

      // In Redis
      await this.redisService.deleteNotification(userId, notificationId);

      // In Database (soft delete)
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, user: { id: userId } },
      });

      if (!notification) {
        throw HttpError.notFound('Notification not found');
      }

      await this.notificationRepository.softRemove(notification);

      return { message: 'Notification deleted' };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error deleting notification');
    }
  }

  /**
   * Clears all notifications
   */
  async clearNotifications(userId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      // In Redis
      await this.redisService.clearNotifications(userId);

      // In Database (soft delete)
      await this.notificationRepository.softDelete({ user: { id: userId } });

      return { message: 'All notifications cleared' };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error clearing notifications');
    }
  }

  /**
   * Creates a notification in Redis and Database
   */
  async createNotification(
    userId: string,
    type: 'task' | 'post' | 'comment' | 'submission' | 'grade' | 'general',
    title: string,
    message: string,
    data?: any
  ) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      if (!title || !message) {
        throw HttpError.badRequest('Title and message are required');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw HttpError.notFound('User not found');
      }

      // Notification in Redis (instant)
      await this.redisService.notifyUser({
        userId,
        type,
        title,
        message,
        data,
        read: false,
      });

      // Save in Database asynchronously
      const notification = this.notificationRepository.create({
        user,
        type,
        title,
        message,
        data,
        read: false,
      });

      setImmediate(async () => {
        try {
          await this.notificationRepository.save(notification);
        } catch (error) {
          console.error('Error saving notification to database:', error);
        }
      });

      return { message: 'Notification created', data: notification };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error creating notification');
    }
  }

  /**
   * Gets WebSocket connection statistics
   */
  getConnectionStats() {
    try {
      return this.redisService.getConnectionStats();
    } catch (error) {
      throw HttpError.internalServerError(
        'Error getting connection statistics'
      );
    }
  }

  /**
   * Syncs notifications from Redis to Database
   */
  async syncRedisToDatabase(userId: string) {
    try {
      if (!userId) {
        throw HttpError.badRequest('User ID is required');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw HttpError.notFound('User not found');
      }

      const redisNotifications = await this.redisService.getNotifications(
        userId,
        100
      );

      let synced = 0;
      for (const notif of redisNotifications) {
        const exists = await this.notificationRepository.findOne({
          where: { id: notif.id },
        });

        if (!exists) {
          const dbNotif = this.notificationRepository.create({
            id: notif.id,
            user,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            data: notif.data,
            read: notif.read,
            createdAt: new Date(notif.createdAt),
          });
          await this.notificationRepository.save(dbNotif);
          synced++;
        }
      }

      return {
        message: `${synced} notifications synchronized successfully`,
        synced,
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw HttpError.internalServerError('Error synchronizing notifications');
    }
  }
}
