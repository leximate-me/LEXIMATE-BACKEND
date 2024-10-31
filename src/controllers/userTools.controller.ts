import {
  extractTextFromPdfService,
  extractTextFromDocxService,
} from '../services/userTool.service';
import { logger } from '../configs/logger.config';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

const extractTextFromFileController = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.file) {
      throw new Error('No se ha proporcionado ningún archivo');
    }
    const file = req.files.file as UploadedFile;
    const filePath = file.tempFilePath; // Obtener la ruta del archivo cargado temporalmente
    console.log('Ruta del archivo:', filePath);

    let text;
    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPdfService(filePath);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractTextFromDocxService(filePath);
    } else {
      throw new Error('Tipo de archivo no soportado');
    }

    // Enviar la respuesta JSON
    res.status(200).json({ text });

    // Eliminar el archivo temporal después de enviar la respuesta
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(`Error al eliminar el archivo temporal: ${err.message}`);
      } else {
        logger.info(`Archivo temporal eliminado: ${filePath}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error, 'Error en extractTextFromFileController');
      res.status(400).json({ error: error.message });
    } else {
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
};

export { extractTextFromFileController };
