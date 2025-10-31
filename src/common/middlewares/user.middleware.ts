import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../../database/db';
import { User } from '../../modules/user/entities/user.entity';
import { HttpError } from '../libs/http-error';

export const verifyUserRequired = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const id = request.user?.id;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (user?.verified !== true) {
      throw HttpError.forbidden('User not verified');
    }
  } catch (error) {
    reply.code(500).send({
      message: error instanceof Error ? error.message : 'Error interno',
    });
  }
};
