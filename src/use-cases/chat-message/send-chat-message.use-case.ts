import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageRepositoryPort } from './chat-message.repository.port';
import { ChatMessage } from 'src/domain/entity/chat-message.entity';
import { ChatSessionRepositoryPort } from '../chat-session/chat-session.repository.port';
import { MessageRole } from 'src/adapters/shared/enums';

@Injectable()
export class SendChatMessageUseCase {
  constructor(
    private readonly chatMessageRepository: ChatMessageRepositoryPort,
    private readonly chatSessionRepository: ChatSessionRepositoryPort,
  ) {}

  async execute(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const sessionExist = await this.chatSessionRepository.show(
      data.session_id!,
    );
    if (!sessionExist) {
      throw new NotFoundException({
        status: 'false',
        message: 'Chat tidak di temukan',
      });
    }
    const chatMessage = await this.chatMessageRepository.sendMessage({
      ...data,
      role: MessageRole.USER,
    });
    return chatMessage;
  }
}
