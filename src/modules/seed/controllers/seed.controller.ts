import { FastifyRequest, FastifyReply } from 'fastify';
import { SeedService } from '@modules/seed/services/seed.service';

export class SeedController {
  private readonly seedService = new SeedService();

  async seedAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.seedService.seedAll();
    reply.code(200).send(result);
  }
}
