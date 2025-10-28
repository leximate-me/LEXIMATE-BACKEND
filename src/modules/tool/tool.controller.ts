import { logger } from '../../common/configs/logger.config';
import { NextFunction, Request, Response } from 'express';
import { ToolService } from './tool.service';

export class ToolController {
  private toolService: ToolService = new ToolService();

  async extractTextFromFile(req: Request, res: Response, next: NextFunction) {
    try {
      const imageUrl = req.query.imageUrl as string;

      const text = await this.toolService.extractTextFromImage(imageUrl);

      res.status(200).json(text);
    } catch (error) {
      next(error);
    }
  }
}
