import Tesseract from 'tesseract.js';

export class ToolService {
  async extractTextFromImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('La imagen no se pudo cargar');
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      const { data } = await Tesseract.recognize(imageBuffer, 'spa');
      const { words } = data;

      let minFontSize = Infinity;
      let maxFontSize = -Infinity;

      words.forEach((word: any) => {
        const { font_size } = word;
        if (font_size < minFontSize) minFontSize = font_size;
        if (font_size > maxFontSize) maxFontSize = font_size;
      });

      const textItems = words.map((word: any) => {
        let { text, bbox, font_size } = word;
        text = text.toUpperCase();

        if (!bbox || typeof bbox !== 'object') {
          throw new Error('bbox is not an object');
        }

        let classification;
        const fontSizeRange = maxFontSize - minFontSize;
        const titleThreshold = minFontSize + fontSizeRange * 0.7;
        const subtitleThreshold = minFontSize + fontSizeRange * 0.4;

        if (font_size >= titleThreshold) {
          classification = 'title';
        } else if (font_size >= subtitleThreshold) {
          classification = 'subtitle';
        } else {
          classification = 'text';
        }

        if (text.endsWith('.')) {
          text = text + '\n';
        }

        return {
          text,
          classification,
        };
      });

      return textItems;
    } catch (error) {
      throw error;
    }
  }
}
