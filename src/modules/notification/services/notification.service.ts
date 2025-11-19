import { Repository } from 'typeorm';
import { AppDataSource } from '@database/db';
import { Notification } from '@notification/entities';
import { HttpError } from '@common/libs/http-error';
import { notificationEmitter } from '@common/events/notification.events';
import { CreateNotificationDto } from '@notification/dtos';
import { NotificationEnum } from '@common/enums/notification.enum';

export class NotificationService {
  private notificationRepository: Repository<Notification>;

  constructor() {
    this.notificationRepository = AppDataSource.getRepository(Notification);
    this.setupListeners();
  }

  private setupListeners() {
    notificationEmitter.on('create_notification', async (payload: CreateNotificationDto) => {
      await this.createNotification(payload);
    });
  }

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: createNotificationDto.userId,
      type: createNotificationDto.type as NotificationEnum,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      data: createNotificationDto.data,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    notificationEmitter.emit('notification_created', savedNotification);

    return savedNotification;
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const where: any = { userId };
    
    if (unreadOnly) {
      where.read = false;
    }

    return await this.notificationRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw HttpError.notFound('Notification not found');
    }

    notification.read = true;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    );
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw HttpError.notFound('Notification not found');
    }

    await this.notificationRepository.remove(notification);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, read: false },
    });
  }
}
