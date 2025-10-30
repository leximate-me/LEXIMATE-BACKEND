import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../configs/env.config';
import { logger } from '../configs/logger.config';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../libs/http-error';

export const authRequired = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.log.info(
    { url: request.url, cookies: request.cookies, headers: request.headers },
    'authRequired ejecutado'
  );
  try {
    const token =
      request.cookies?.token || request.headers.authorization?.split(' ')[1];
    reply.log.debug(`Token recibido: ${token}`);

    console.log('Headers:', request.headers);
    console.log('Cookies:', request.cookies);

    if (!token) {
      reply.code(401).send({ message: 'Token no proporcionado' });
      return;
    }

    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    if (!decoded) {
      reply.code(401).send({ message: 'Token inválido' });
      return;
    }

    request.user = decoded;
  } catch (error) {
    reply.log.error(error);
    reply.code(401).send({
      message: error instanceof Error ? error.message : 'No autorizado',
    });
  }
};
