import { FastifyRequest, FastifyReply } from 'fastify';
import { ToolService } from '@tool/services/tool.service';

export class ToolController {
  private toolService: ToolService = new ToolService();

  async extractTextFromLocalUrl(request: FastifyRequest, reply: FastifyReply) {
    const localUrl = (request.query as any).localUrl as string;

    const result = await this.toolService.extractTextFromLocalPath<any>(localUrl);
    reply.code(200).send({ text: result.text, pages: result.pages });
  }

  async chatBotResponse(request: FastifyRequest, reply: FastifyReply) {
    const { message } = request.body as any;
    const token = request.cookies?.token as string;
    const response = await this.toolService.getChatBotResponse(message, token);
    reply.code(200).send({ response });
  }

  async getMarkdownUrl(request: FastifyRequest, reply: FastifyReply) {
    const url = (request.query as any).url as string;
    const markdown = await this.toolService.getMarkdownUrl(url);
    reply.code(200).send({ markdown });
  }

  // Si necesitas manejar archivos, puedes adaptar el método comentado así:
  // async sendFilesToChatBot(request: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     // Maneja archivos con request.parts() o request.file()
  //     const token = request.cookies?.token as string;
  //     // const files = ... // extrae archivos según tu lógica
  //     const response = await this.toolService.sendFilesToChatBot(files, token);
  //     reply.code(200).send({ response });
  //   } catch (error) {
  //     reply.code(500).send({ error: 'Error enviando archivos', details: error });
  //   }
  // }

}
