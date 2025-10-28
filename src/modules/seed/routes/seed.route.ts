import { Router } from 'express';
import { SeedController } from '../seed.controller';

const router = Router();
const seedController = new SeedController();

router.post('/all', seedController.seedAll.bind(seedController));

export { router as seedRouter };
