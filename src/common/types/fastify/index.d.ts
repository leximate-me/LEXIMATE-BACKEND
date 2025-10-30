import { TokenPayload } from '../../interfaces/token-payload.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}
