import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatService } from '@chat/services/chat.service';
import { CreateChatDto, SendMessageDto } from '@chat/dtos';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  async createChat(request: FastifyRequest<{ Body: CreateChatDto }>, reply: FastifyReply) {
    const createChatDto = request.body;
    const currentUserId = request.user.id;

    const chat = await this.chatService.createChat(createChatDto, currentUserId);
    return reply.code(201).send(chat);
  }

  async getUserChats(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const userId = request.user.id;
    const chats = await this.chatService.getUserChats(userId);
    return reply.send(chats);
  }

  async getChatMessages(request: FastifyRequest<{ Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const messages = await this.chatService.getChatMessages(chatId);
    return reply.send(messages);
  }

  async sendMessage(request: FastifyRequest<{ Params: { chatId: string }; Body: SendMessageDto }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const sendMessageDto = request.body;
    const senderId = request.user.id;

    const message = await this.chatService.sendMessage(chatId, senderId, sendMessageDto);
    return reply.code(201).send(message);
  }

  async getChatById(request: FastifyRequest<{ Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const chat = await this.chatService.getChatById(chatId);

    return reply.send(chat);
  }

  async markChatAsRead(request: FastifyRequest<{ Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;
    const userId = request.user.id;

    await this.chatService.markChatAsRead(chatId, userId);

    return reply.code(200).send({ message: 'Chat marked as read' });
  }
}
