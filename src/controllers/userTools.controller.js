import {
  extractTextFromPdfService,
  extractTextFromDocxService,
} from '../services/userTools.service.js';
import { logger } from '../configs/loggerConfig.js';
import fs from 'fs';

const extractTextFromFileController = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      throw new Error('No se ha proporcionado ningún archivo');
    }
    const file = req.files.file;
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
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export { extractTextFromFileController };
