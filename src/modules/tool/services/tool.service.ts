import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import path from 'path';
import { HttpError } from '@common/libs/http-error';
import { LlamaParseReader } from 'llama-cloud-services';

export class ToolService {
  async extractTextFromLocalPath<T>(localUrl: string): Promise<T> {
    if (!localUrl) {
      throw HttpError.badRequest('La URL local del PDF es requerida');
    }

    let filePath: string;
    let isTemp = false;

    if (localUrl.startsWith('http://') || localUrl.startsWith('https://')) {
      let downloadUrl = localUrl;

      const gDriveMatch = localUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (gDriveMatch && localUrl.includes('drive.google.com')) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${gDriveMatch[1]}`;
      }

      const tempDir = path.resolve(process.cwd(), 'public', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const fileName = `temp_${Date.now()}.pdf`;
      filePath = path.join(tempDir, fileName);

      try {
        const response = await axios.get(downloadUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', () => resolve(true));
          writer.on('error', reject);
        });
        isTemp = true;
      } catch (error) {
        console.error('Error downloading file:', error);
        throw HttpError.internalServerError('Error descargando el archivo remoto');
      }
    } else {
      const decodedUrl = decodeURIComponent(localUrl);
      filePath = path.resolve(
        process.cwd(),
        'public',
        decodedUrl.replace(/^public\/+/, '').replace(/^\/+/, '')
      );

      if (!fs.existsSync(filePath)) {
        console.error(`File not found at path: ${filePath}`);
        throw HttpError.notFound(`Archivo no encontrado en: ${decodedUrl}`);
      }
    }

    try {

      const reader = new LlamaParseReader({
        resultType: "markdown",
        parsingInstruction: `Reformat and summarize the content following these rules:
        - Use left alignment.
        - Use short, simple sentences in active voice.
        - Avoid dense paragraphs; use bullet points where possible.
        - Avoid double negatives.
        - Be concise.
        - Output in Spanish.
        - IMPORTANT: Remove all headers, footers, and page numbers. Do not include metadata like 'Page X of Y'.`
      });

      const documents = await reader.loadData(filePath);

      if (!documents || documents.length === 0) {
        throw HttpError.internalServerError('No pages found in the PDF or job timed out/failed');
      }

      const text = documents.map(doc => doc.text).join('\n\n');
      const pages = documents.map((doc, index) => ({
        page: index + 1, // LlamaParseReader might not return page numbers directly in the same way, assuming sequential
        text: doc.text
      }));
      const numPages = documents.length;

      return {
        text,
        pages,
        numpages: numPages,
        info: null,
        metadata: null,
        version: null,
      } as any;
    } catch (error) {
      console.error('Error in extractTextFromLocalPath:', error);
      if (error instanceof HttpError) {
        throw error;
      }
      throw HttpError.internalServerError('Error procesando el archivo PDF');
    } finally {
      if (isTemp && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
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

