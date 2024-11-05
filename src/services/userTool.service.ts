import Tesseract from 'tesseract.js';

const extractTextFromImageService = async (imageBuffer: Buffer) => {
  try {
    const { data } = await Tesseract.recognize(imageBuffer, 'spa');
    const { words } = data;

    const textItems = words.map((word: any) => {
      const { text, confidence, bbox } = word;

      // Verificar que bbox esté presente y sea un objeto
      if (!bbox || typeof bbox !== 'object') {
        throw new Error('bbox is not an object');
      }

      const { x0, y0, x1, y1 } = bbox;

      // Clasificación básica basada en el tamaño de la fuente y la posición
      let classification = 'paragraph';
      if (confidence > 80 && y1 - y0 > 20) {
        classification = 'title';
      } else if (confidence > 60 && y1 - y0 > 15) {
        classification = 'subtitle';
      }

      return {
        text,
        confidence,
        coordinates: { x0, y0, x1, y1 },
        classification,
      };
    });
    console.log(textItems.map((item) => item.text).join(' '));
    return textItems;
  } catch (error) {
    throw error;
  }
};

export { extractTextFromImageService };
