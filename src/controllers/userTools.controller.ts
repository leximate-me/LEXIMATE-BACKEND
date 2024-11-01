import {
  extractTextFromPdfService,
  extractTextFromDocxService,
} from '../services/userTool.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';

const extractTextFromFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error('No se ha proporcionado ningún archivo');
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
      throw new Error('Tipo de archivo no soportado');
    }

    // Enviar la respuesta JSON
    res.status(200).json(text);
  } catch (error: Error | any) {
    logger.error(error, 'Error al extraer texto del archivo');
    res.status(400).json({ error: error.message });
  }
};

export { extractTextFromFileController };
