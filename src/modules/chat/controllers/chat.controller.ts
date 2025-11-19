import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatService } from '@chat/services/chat.service';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  async createChat(request: FastifyRequest<{Body: { userIds: string[] } }>, reply: FastifyReply) {
    const { userIds } = request.body;
    
    const currentUserId = request.user.id;
    if (!userIds.includes(currentUserId)) {
        userIds.push(currentUserId);
    }
    
    const chat = await this.chatService.createChat(userIds);
    return reply.code(201).send(chat);
  }

  async getUserChats(request: FastifyRequest<{Params: { userId: string } }>, reply: FastifyReply) {
    const userId = request.user.id;
    const chats = await this.chatService.getUserChats(userId);
    return reply.send(chats);
  }

  async getChatMessages(request: FastifyRequest<{Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const messages = await this.chatService.getChatMessages(chatId);
    return reply.send(messages);
  }

  async sendMessage(request: FastifyRequest<{Params: { chatId: string },Body: { content: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const { content } = request.body;
    const senderId = request.user.id;

    const message = await this.chatService.sendMessage(chatId, senderId, content);
    return reply.code(201).send(message);
  }

  async getChatById(request: FastifyRequest<{Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const chat = await this.chatService.getChatById(chatId);
    
    return reply.send(chat);
  }
}
