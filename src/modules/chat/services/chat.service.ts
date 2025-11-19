import { Repository } from 'typeorm';
import { AppDataSource } from '@database/db';
import { Chat, Message } from '@chat/entities';
import { User } from '@user/entities/user.entity';
import { HttpError } from '@common/libs/http-error';
import { chatEventEmitter } from '@common/events/chat.events';
import { CreateChatDto, SendMessageDto } from '@chat/dtos';

export class ChatService {
  private chatRepository: Repository<Chat>;
  private messageRepository: Repository<Message>;
  private userRepository: Repository<User>;

  constructor() {
    this.chatRepository = AppDataSource.getRepository(Chat);
    this.messageRepository = AppDataSource.getRepository(Message);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createChat(createChatDto: CreateChatDto, currentUserId: string): Promise<Chat> {
    const { userIds } = createChatDto;
    
    const allUserIds = userIds.includes(currentUserId) ? userIds : [...userIds, currentUserId];
    const uniqueUserIds = [...new Set(allUserIds)];
    
    if (uniqueUserIds.length < 2) {
      throw HttpError.badRequest('A chat must have at least 2 participants');
    }

    const users = await this.userRepository.findByIds(uniqueUserIds);
    if (users.length !== uniqueUserIds.length) {
      throw HttpError.notFound('One or more users not found');
    }

    const chat = this.chatRepository.create({
      users,
    });

    return await this.chatRepository.save(chat);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users', 'messages'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: {
        chatId,
      },
      relations: ['sender'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async sendMessage(chatId: string, senderId: string, sendMessageDto: SendMessageDto): Promise<Message> {
    const { content } = sendMessageDto;
    
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users'],
    });

    if (!chat) {
      throw HttpError.notFound('Chat not found');
    }

    const isParticipant = chat.users.some((u) => u.id === senderId);
    if (!isParticipant) {
      throw HttpError.forbidden('User is not a participant of this chat');
    }

    const message = this.messageRepository.create({
      content,
      senderId,
      chatId,
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.chatRepository.update(chatId, { updatedAt: new Date() });

    chatEventEmitter.emit('new_message', savedMessage);

    return savedMessage;
  }
  
  async getChatById(chatId: string): Promise<Chat | null> {
      return await this.chatRepository.findOne({
          where: { id: chatId },
          relations: ['users']
      });
  }
}
