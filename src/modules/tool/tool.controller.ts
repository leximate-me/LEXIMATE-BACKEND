import { logger } from '../../common/configs/logger.config';
import { Request, Response } from 'express';
import { ToolService } from './tool.service';

export class ToolController {
  private toolService: ToolService = new ToolService();

  async extractTextFromFile(req: Request, res: Response): Promise<void> {
    try {
      const imageUrl = req.query.imageUrl as string;

      if (!imageUrl) {
        res.status(400).json({ error: 'Falta la URL de la imagen' });
        return;
      }

      const text = await this.toolService.extractTextFromImage(imageUrl);

      res.status(200).json(text);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, 'Error en extractTextFromFileController');
        res.status(400).json({ error: error.message });
      } else {
        logger.error(
          error,
          'Error desconocido en extractTextFromFileController'
        );
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  }
}
