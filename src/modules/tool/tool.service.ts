import Tesseract from 'tesseract.js';
import { FormData, fetch } from 'undici';
import { HttpError } from '../../common/libs/http-error';
import { PDFParse, TextResult } from 'pdf-parse';
import { promises as fs } from 'fs';
import path from 'path';

export class ToolService {
  async extractTextFromLocalPath(localUrl: string): Promise<TextResult> {
    try {
      if (!localUrl) {
        throw HttpError.badRequest('La URL local del PDF es requerida');
      }
      // Convierte la URL local a ruta absoluta
      const filePath = path.join(process.cwd(), localUrl.replace(/^\/+/, ''));
      const buffer = await fs.readFile(filePath);
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse({ data: uint8Array });
      return await parser.getText();
    } catch (error) {
      throw HttpError.internalServerError(
        'No se pudo leer o procesar el PDF local'
      );
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
