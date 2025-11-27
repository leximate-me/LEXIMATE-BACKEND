import { Repository, In } from 'typeorm';
import { AppDataSource } from '@database/db';
import { Chat, Message } from '@chat/entities';
import { User } from '@user/entities/user.entity';
import { RoleEnum } from '@common/enums/role.enum';
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

    if (uniqueUserIds.length === 2) {
      const existingChats = await this.chatRepository
        .createQueryBuilder('chat')
        .innerJoin('chat.users', 'user')
        .where('user.id IN (:...userIds)', { userIds: uniqueUserIds })
        .groupBy('chat.id')
        .having('COUNT(DISTINCT user.id) = :count', { count: uniqueUserIds.length })
        .getMany();

      for (const chat of existingChats) {
        const chatUserIds = chat.users.map(u => u.id).sort();
        const requestUserIds = uniqueUserIds.sort();

        if (chatUserIds.length === requestUserIds.length &&
          chatUserIds.every((id, index) => id === requestUserIds[index])) {
          return chat;
        }
      }
    }
    const users = await this.userRepository.find({
      where: {
        id: In(uniqueUserIds)
      }
    });

    if (users.length !== uniqueUserIds.length) {
      throw HttpError.notFound('One or more users not found');
    }

    const studentCount = users.filter(user => user.role.name === RoleEnum.STUDENT).length;
    if (studentCount > 1) {
      throw HttpError.forbidden('Students cannot chat with each other');
    }

    const chat = this.chatRepository.create({
      users,
    });

    const savedChat = await this.chatRepository.save(chat);

    return savedChat;
  }

  async getUserChats(userId: string): Promise<any[]> {
    const chats = await this.chatRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users', 'messages', 'messages.sender'],
      order: {
        updatedAt: 'DESC',
      },
    });

    // Calculate unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(
        msg => !msg.readAt && msg.senderId !== userId
      ).length;

      // Get the other user
      const otherUser = chat.users.find(u => u.id !== userId);

      return {
        ...chat,
        unreadCount,
        otherUser
      };
    });

    return chatsWithUnread;
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

  async markChatAsRead(chatId: string, userId: string): Promise<void> {
    // Update all messages in this chat that are NOT sent by the current user and are unread
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ readAt: new Date() })
      .where("chatId = :chatId", { chatId })
      .andWhere("senderId != :userId", { userId })
      .andWhere("readAt IS NULL")
      .execute();
  }
}
