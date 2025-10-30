import { Router } from 'express';
import { FastifyInstance } from 'fastify';
import { SeedController } from '../seed.controller';

// const router = Router();
// const seedController = new SeedController();

// router.post('/all', seedController.seedAll.bind(seedController));

// export { router as seedRouter };

export async function seedRouter(fastify: FastifyInstance) {
  const seedController = new SeedController();

  fastify.post('/all', seedController.seedAll.bind(seedController));
}
