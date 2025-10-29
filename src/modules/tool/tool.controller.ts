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

  async chatBotResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;

      const token = req.cookies.token as string;

      const response = await this.toolService.getChatBotResponse(
        message,
        token
      );

      res.status(200).json({ response });
    } catch (error) {
      next(error);
    }
  }

  async getMarkdownUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const url = req.query.url as string;
      const markdown = await this.toolService.getMarkdownUrl(url);

      res.status(200).json({ markdown });
    } catch (error) {
      next(error);
    }
  }

  // async sendFilesToChatBot(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const files = req.files as Express.Multer.File[];
  //     const token = req.cookies.token as string;

  //     const response = await this.toolService.sendFilesToChatBot(files, token);
  //     res.status(200).json({ response });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
