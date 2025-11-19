import { PDFParse, TextResult } from 'pdf-parse';
import { promises as fs } from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import path from 'path';
import { HttpError } from '@common/libs/http-error';
import { error } from 'console';

export class ToolService {
  async extractTextFromLocalPath(localUrl: string): Promise<TextResult> {
      if (!localUrl) {
        throw HttpError.badRequest('La URL local del PDF es requerida');
      }
      const filePath = path.resolve(
        process.cwd(),
        'public',
        localUrl.replace(/^public\/+/, '').replace(/^\/+/, '')
      );

      const apiKey = process.env.LLAMA_CLOUD_API_KEY;
      if (!apiKey) {
        throw HttpError.internalServerError('LLAMA_CLOUD_API_KEY no configurada');
      }

      const formData = new FormData();
      formData.append('file', await fs.readFile(filePath), {
        filename: path.basename(filePath),
      });
      formData.append('max_pages', 25);
      formData.append('parse_mode', 'parse_page_with_agent');
      formData.append('model', 'openai-gpt-4o-mini');
      formData.append('high_res_ocr', 'true');
      formData.append('adaptive_long_table', 'true');
      formData.append('outlined_table_extraction', 'true');
      formData.append('output_tables_as_HTML', 'true');
      formData.append('precise_bounding_box', 'true');

      const uploadResponse = await axios.post(
        'https://api.cloud.llamaindex.ai/api/v1/parsing/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const jobId = uploadResponse.data.id;

      let pagesResult: any[] = [];
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 5000));

        try {
          const resultResponse = await axios.get(
            `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/json`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );

          pagesResult = resultResponse.data.pages;
          break;
        } catch (error: any) {
          if (error.response && (error.response.status === 400 || error.response.status === 404)) {
             continue;
          }
          throw error;
        }
      }

      if (!pagesResult || pagesResult.length === 0) {
        throw HttpError.internalServerError('No pages found in the PDF');
      }
      console.log(pagesResult);

      const text = pagesResult.map(p => p.md ).join('\n\n');
      const pages = pagesResult.map((p) => ({
        page: p.page,
        text: p.md
      }));
      const numPages = pagesResult.map(p => p.page).length;
      console.log('Total pages:', numPages);

      return {
        text,
        pages,
        numpages: numPages,
        info: null,
        metadata: null,
        version: null,
      } as any;
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
