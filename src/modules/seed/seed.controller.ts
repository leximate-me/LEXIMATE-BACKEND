import { Request, Response } from 'express';
import { SeedService } from './seed.service';

export class SeedController {
  private readonly seedService = new SeedService();

  async seedAll(req: Request, res: Response) {
    try {
      const result = await this.seedService.seedAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
