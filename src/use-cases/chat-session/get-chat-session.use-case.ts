import { Injectable } from '@nestjs/common';
import { ChatSessionRepositoryPort } from './chat-session.repository.port';
import { ChatSession } from 'src/domain/entity/chat-session.entity';

@Injectable()
export class GetChatSessionUseCase {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepositoryPort,
  ) {}

  async execute(id: string): Promise<ChatSession[]> {
    const chatSession = await this.chatSessionRepository.get(id);
    return chatSession;
  }
}
