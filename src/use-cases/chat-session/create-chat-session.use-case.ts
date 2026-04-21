import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionRepositoryPort } from './chat-session.repository.port';
import { ChatSession } from 'src/domain/entity/chat-session.entity';
import { ChatMessage } from 'src/domain/entity/chat-message.entity';
import { MessageRole } from 'src/adapters/shared/enums';

@Injectable()
export class CreateChatSessionUseCase {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepositoryPort,
  ) {}

  async execute(data: Partial<ChatSession>): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.save({
      ...data,
      title: data.title ?? data.messages![0].content.slice(0, 254),
      messages: data.messages?.map((message: ChatMessage) => {
        return {
          ...message,
          content: message.content,
          role: MessageRole.USER,
        };
      }),
    });
    return chatSession;
  }
}
