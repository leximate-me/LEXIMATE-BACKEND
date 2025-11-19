import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationService } from '@notification/services/notification.service';

export class NotificationController {
  private notificationService: NotificationService = new NotificationService();

  async getUserNotifications(request: FastifyRequest<{
    Querystring: {
      unreadOnly: string;
    }
  }>, reply: FastifyReply) {
    const userId = request.user.id;
    const unreadOnly = request.query.unreadOnly === 'true';

    const notifications = await this.notificationService.getUserNotifications(userId, unreadOnly);
    
    reply.code(200).send(notifications);
  }

  async markAsRead(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    const notificationId = request.params.notificationId;

    const notification = await this.notificationService.markAsRead(notificationId, userId);
    
    reply.code(200).send(notification);
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;

    await this.notificationService.markAllAsRead(userId);
    
    reply.code(200).send({ message: 'All notifications marked as read' });
  }

  async deleteNotification(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    const notificationId = request.params.notificationId;

    await this.notificationService.deleteNotification(notificationId, userId);
    
    reply.code(204).send();
  }

  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;

    const count = await this.notificationService.getUnreadCount(userId);
    
    reply.code(200).send({ count });
  }
}
