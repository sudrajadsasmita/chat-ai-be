import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatSessionRepositoryPort } from './chat-session.repository.port';
import { ChatSession } from 'src/domain/entity/chat-session.entity';

@Injectable()
export class DeleteChatSessionUseCase {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepositoryPort,
  ) {}

  async execute(id: string): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.show(id);
    if (!chatSession) {
      throw new NotFoundException({
        status: 'false',
        message: 'Chat tidak di temukan',
      });
    }
    await this.chatSessionRepository.delete(chatSession.id);
    return chatSession;
  }
}
