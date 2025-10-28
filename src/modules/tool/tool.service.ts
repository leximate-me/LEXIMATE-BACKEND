import Tesseract from 'tesseract.js';
import { HttpError } from '../../common/libs/http-error';
import { EnvConfiguration } from '../../common/configs/env.config';
import { logger } from 'src/common/configs/logger.config';
import th from 'zod/v4/locales/th.js';

export class ToolService {
  private readonly;

  async extractTextFromImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw HttpError.badRequest('La imagen no se pudo cargar');
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
          throw HttpError.internalServerError('bbox is not an object');
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

  async getChatBotResponse(message: string, token: string) {
    const response = await fetch(EnvConfiguration().n8nChatProdUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response) {
      throw HttpError.internalServerError('No response from chatbot service');
    }

    return await response.json();
  }

  // async sendFilesToChatBot(files: Express.Multer.File[], token: string) {
  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append('files', new Blob([file.buffer]), file.originalname);
  //   });

  //   const response = await fetch(EnvConfiguration().n8nProdUrl, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: formData,
  //   });
  //   if (!response) {
  //     throw HttpError.internalServerError('No response from chatbot service');
  //   }
  //   return await response.json();
  // }
}
