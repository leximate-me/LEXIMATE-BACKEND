import Tesseract from 'tesseract.js';
import { FormData, fetch } from 'undici';
import { HttpError } from '../../common/libs/http-error';

export class ToolService {
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

  async getMarkdownUrl(url: string) {
    const response = await fetch(`https://r.jina.ai/${url}`);

    if (!response.ok) {
      throw HttpError.badRequest('No se pudo obtener el markdown');
    }
    console.log(response);

    return await response.text();
  }

  async getChatBotResponse(message: string, token: string) {
    const response = await fetch(process.env.N8N_CHAT_PROD_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response) {
      throw HttpError.internalServerError('No response from chatbot service');
    }

    return await response.json();
  }

  async sendFilesToChatBot(files: Express.Multer.File[], token: string) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(
        'file',
        new Blob([new Uint8Array(file.buffer)]),
        file.originalname
      );
    });

    const response = await fetch(process.env.N8N_RAG_PROD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response) {
      throw HttpError.internalServerError('No response from chatbot service');
    }

    return await response.json();
  }
}
