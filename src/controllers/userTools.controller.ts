import { extractTextFromImageService } from '../services/userTool.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';

const extractTextFromFileController = async (req: Request, res: Response) => {
  try {
    const imageUrl = req.query.imageUrl as string;

    if (!imageUrl) {
      res.status(400).json({ error: 'Falta la URL de la imagen' });
      return;
    }

    const text = await extractTextFromImageService(imageUrl);

    // Enviar la respuesta JSON
    res.status(200).json(text);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en extractTextFromFileController');
      res.status(400).json({ error: error.message });
    } else {
      logger.error(error, 'Error desconocido en extractTextFromFileController');
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
};

export { extractTextFromFileController };
