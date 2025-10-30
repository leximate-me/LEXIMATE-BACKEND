import { Request, Response } from 'express';
import { SeedService } from './seed.service';
import { FastifyRequest, FastifyReply } from 'fastify';

export class SeedController {
  private readonly seedService = new SeedService();

  async seedAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.seedService.seedAll();
      reply.code(200).send(result);
    } catch (error) {
      reply.code(200).send({ error: (error as Error).message });
    }
  }
}
