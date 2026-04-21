import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/domain/entity/chat-message.entity';
import { ChatMessageRepositoryPort } from 'src/use-cases/chat-message/chat-message.repository.port';
import { ChatMessageOrm } from './typeorm/chat-message.entity.orm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessageTypeormRepository implements ChatMessageRepositoryPort {
  constructor(
    @InjectRepository(ChatMessageOrm)
    private readonly repo: Repository<ChatMessageOrm>,
  ) {}
  async sendMessage(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const chatMessage = this.repo.create(data);
    const saved = await this.repo.save(chatMessage);
    return saved.toDomain();
  }
}
