import { PDFParse, TextResult } from 'pdf-parse';
import fs from 'fs';
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
    formData.append('file', await fs.promises.readFile(filePath), {
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
    formData.append('file', fs.createReadStream(filePath)); // Changed to use filePath and fs.createReadStream
    formData.append('user_prompt', `Reformat and summarize the content following these rules:
- Use left alignment.
- Use short, simple sentences in active voice.
- Avoid dense paragraphs; use bullet points where possible.
- Avoid double negatives.
- Be concise.
- Output in Spanish.
- IMPORTANT: Remove all headers, footers, and page numbers. Do not include metadata like 'Page X of Y'.`);

    const uploadResponse = await axios.post( // Renamed resultResponse to uploadResponse for clarity
      'https://api.cloud.llamaindex.ai/api/v1/parsing/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const jobId = uploadResponse.data.id; // Changed resultResponse to uploadResponse
    console.log('Job ID:', jobId);

    // Polling para verificar el estado del trabajo
    let status = 'PENDING';
    let pagesResult: any[] = [];
    const maxAttempts = 60; // Added maxAttempts for polling loop
    let attempts = 0; // Added attempts counter

    while ((status === 'PENDING' || status === 'STARTED') && attempts < maxAttempts) { // Added attempts condition
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos
      const statusResponse = await axios.get(
        `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      status = statusResponse.data.status;
      console.log('Job Status:', status);

      if (status === 'SUCCESS') {
        const resultUrl = `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/json`;
        const resultResponse = await axios.get(resultUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        pagesResult = resultResponse.data.pages;
        break; // Exit loop on success
      } else if (status === 'ERROR') {
        throw HttpError.internalServerError('Error parsing PDF with LlamaIndex');
      }
    }

    if (!pagesResult || pagesResult.length === 0) {
      throw HttpError.internalServerError('No pages found in the PDF or job timed out/failed'); // Updated error message
    }
    console.log(pagesResult);

    const text = pagesResult.map(p => p.md).join('\n\n');
    const pages = pagesResult.map((p) => ({
      page: p.page,
      text: p.md
      // Removed images mapping
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

