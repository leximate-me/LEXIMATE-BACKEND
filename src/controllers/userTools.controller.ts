import {
  extractTextFromPdfService,
  extractTextFromDocxService,
} from '../services/userTool.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';

const extractTextFromFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
      return;
    }

    const file = req.file;
    const fileBuffer = file.buffer;

    let text;
    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPdfService(fileBuffer);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractTextFromDocxService(fileBuffer);
    } else {
      res.status(400).json({ error: 'Formato de archivo no soportado' });
      return;
    }

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
