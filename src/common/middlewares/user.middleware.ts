import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../../database/db';
import { logger } from '../configs/logger.config';
import { User } from '../../modules/user/entities/user.entity';

export const verifyUserRequired = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const id = request.user?.id;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (user?.verified !== true) {
      reply.log.error('Usuario no verificado');
      reply.code(403).send({ message: 'Usuario no verificado' });
      return;
    }
  } catch (error) {
    reply.code(500).send({
      message: error instanceof Error ? error.message : 'Error interno',
    });
  }
};
