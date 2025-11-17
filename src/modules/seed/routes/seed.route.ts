import { FastifyInstance } from 'fastify';
import { SeedController } from '../seed.controller';

export async function seedRouter(fastify: FastifyInstance) {
  const seedController = new SeedController();

  fastify.post('/all', seedController.seedAll.bind(seedController));
}
