import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../configs/env.config';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../libs/http-error';

export const authRequired = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token =
      request.cookies?.token || request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw HttpError.unauthorized('Token not provided');
    }

    const decoded = jwt.verify(
      token,
      EnvConfiguration().jwtSecret
    ) as TokenPayload;

    if (!decoded) {
      throw HttpError.unauthorized('Invalid token');
    }

    request.user = decoded;
  } catch (error) {
    throw error instanceof HttpError
      ? error
      : HttpError.unauthorized('No autorizado');
  }
};
