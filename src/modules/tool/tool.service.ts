import { PDFParse, TextResult } from 'pdf-parse';
import { promises as fs } from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import path from 'path';

import { HttpError } from '@common/libs/http-error';

export class ToolService {
  async extractTextFromLocalPath(localUrl: string): Promise<TextResult> {
    try {
      if (!localUrl) {
        throw HttpError.badRequest('La URL local del PDF es requerida');
      }
      const filePath = path.resolve(
        process.cwd(),
        'public',
        localUrl.replace(/^public\/+/, '').replace(/^\/+/, '')
      );
      console.log('Intentando leer:', filePath);
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
    try {
      const response = await axios.get(`https://r.jina.ai/${url}`);
      return response.data;
    } catch (error) {
      throw HttpError.badRequest('No se pudo obtener el markdown');
    }
  }

  async getChatBotResponse(message: string, token: string) {
    try {
      const response = await axios.post(
        process.env.N8N_CHAT_PROD_URL!,
        { message },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw HttpError.internalServerError('No response from chatbot service');
    }
  }

  async sendFilesToChatBot(files: Express.Multer.File[], token: string) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('file', file.buffer, file.originalname);
    });

    try {
      const response = await axios.post(
        process.env.N8N_RAG_PROD_URL!,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw HttpError.internalServerError('No response from chatbot service');
    }
  }
}
