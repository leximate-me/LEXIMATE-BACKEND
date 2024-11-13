import { logger } from '../configs/logger.config';
import Tesseract from 'tesseract.js';

const extractTextFromImageService = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('La imagen no se pudo cargar');
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const { data } = await Tesseract.recognize(imageBuffer, 'spa');
    const { words } = data;

    const textItems = words.map((word: any) => {
      const { text, bbox } = word;

      // Verificar que bbox esté presente y sea un objeto
      if (!bbox || typeof bbox !== 'object') {
        throw new Error('bbox is not an object');
      }

      const { x0, y0, x1, y1 } = bbox;

      // Clasificación básica basada en el tamaño de la fuente y la posición
      let classification;
      if (y1 - y0 > 10 && y1 - y0 <= 20) {
        classification = 'text';
      } else if (y1 - y0 > 20 && y1 - y0 <= 30) {
        classification = 'title';
      } else {
        classification = 'subtitle';
      }

      return {
        text,
        coordinates: { x0, y0, x1, y1 },
        classification,
      };
    });
    const textProcess = textItems.map((item) => item.text).join(' ');
    logger.info(textProcess);
    return textItems;
  } catch (error) {
    throw error;
  }
};

export { extractTextFromImageService };
