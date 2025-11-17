import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationService } from './notification.service';
import { HttpError } from '@common/libs/http-error';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { GetNotificationsQueryDto } from './dtos/get-notification-query.dto';
import { MarkAsReadDto } from './dtos/mark-as-read.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

export class NotificationController {
  private notificationService = new NotificationService();

  async getNotifications(
    request: FastifyRequest<{
      Querystring: GetNotificationsQueryDto;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const limit = parseInt(String(request.query.limit || '50'));

      const result = await this.notificationService.getRecentNotifications(
        userId,
        limit
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async getNotificationHistory(
    request: FastifyRequest<{
      Querystring: GetNotificationsQueryDto;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const skip = parseInt(String(request.query.skip || '0'));
      const take = parseInt(String(request.query.take || '100'));

      const result = await this.notificationService.getNotificationHistory(
        userId,
        skip,
        take
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async getAllNotifications(
    request: FastifyRequest<{
      Querystring: GetNotificationsQueryDto;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const limit = parseInt(String(request.query.limit || '50'));

      const result = await this.notificationService.getAllNotifications(
        userId,
        limit
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async getUnreadNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const result = await this.notificationService.getUnreadNotifications(
        userId
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const result = await this.notificationService.getUnreadCount(userId);

      reply.code(200).send({
        statusCode: 200,
        data: result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async markAsRead(
    request: FastifyRequest<{
      Params: { notificationId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const { notificationId } = request.params;

      if (!notificationId) {
        throw HttpError.badRequest('ID de notificación es requerido');
      }

      const result = await this.notificationService.markAsRead(
        userId,
        notificationId
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const result = await this.notificationService.markAllAsRead(userId);

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async deleteNotification(
    request: FastifyRequest<{
      Params: { notificationId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const { notificationId } = request.params;

      if (!notificationId) {
        throw HttpError.badRequest('ID de notificación es requerido');
      }

      const result = await this.notificationService.deleteNotification(
        userId,
        notificationId
      );

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async clearNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const result = await this.notificationService.clearNotifications(userId);

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async getConnectionStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const stats = this.notificationService.getConnectionStats();

      reply.code(200).send({
        statusCode: 200,
        data: stats,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }

  async syncRedisToDatabase(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        throw HttpError.unauthorized('Usuario no autenticado');
      }

      const result = await this.notificationService.syncRedisToDatabase(userId);

      reply.code(200).send({
        statusCode: 200,
        ...result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        message: error.publicMessage || error.message,
      });
    }
  }
}
