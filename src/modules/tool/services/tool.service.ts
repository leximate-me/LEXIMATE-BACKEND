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

      const buffer = await fs.readFile(filePath);
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse({ data: uint8Array });
      return await parser.getText();
    } catch (error) {
      throw HttpError.internalServerError(
        'The local PDF could not be read or processed'
      );
    }
  }

  async getMarkdownUrl(url: string) {
    try {
      const response = await axios.get(`https://r.jina.ai/${url}`);
      return response.data;
    } catch (error) {
      throw HttpError.badRequest(
        'The markdown could not be obtained from the URL'
      );
    }
  }

  async getChatBotResponse(message: string, token: string) {
    const webhookUrl = process.env.N8N_CHAT_PROD_URL;
    if (!webhookUrl) {
      throw HttpError.internalServerError('Webhook URL no configurado');
    }

    const response = await axios.post(
      webhookUrl,
      { message },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
        validateStatus: () => true,
      }
    );

    if (!response) {
      throw HttpError.internalServerError('No response from chat service');
    }

    return response.data;
  }

  async sendFilesToChatBot(files: any[], token: string) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('file', file.buffer, file.originalname);
    });

    const webhookUrl = process.env.N8N_RAG_PROD_URL;

    if (!webhookUrl) {
      throw HttpError.internalServerError('Webhook URL no configurado');
    }

    const response = await axios.post(webhookUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
      validateStatus: () => true,
    });

    if (!response) {
      throw HttpError.internalServerError('No response from RAG service');
    }

    return response.data;
  }
}
