import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from 'src/domain/entity/chat-session.entity';
import { ChatSessionRepositoryPort } from 'src/use-cases/chat-session/chat-session.repository.port';
import { Repository } from 'typeorm';
import { ChatSessionOrm } from './typeorm/chat-session.entity.orm';

@Injectable()
export class ChatSessionTypeormRepository implements ChatSessionRepositoryPort {
  constructor(
    @InjectRepository(ChatSessionOrm)
    private readonly repo: Repository<ChatSessionOrm>,
  ) {}

  async save(data: Partial<ChatSession>): Promise<ChatSession> {
    const created = this.repo.create(data);
    const saved = await this.repo.save(created);
    return saved.toDomain();
  }

  async get(id: string): Promise<ChatSession[]> {
    const sessions = await this.repo.find({
      relations: ['messages', 'user'],
      order: {
        updated_at: 'DESC', // 🔥 penting untuk UX chat
      },
    });

    return sessions.map((session) => session.toDomain());
  }

  async show(id: string): Promise<ChatSession | null> {
    const session = await this.repo.findOne({
      where: { id },
      relations: ['messages', 'user'],
    });

    return session ? session.toDomain() : null;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.repo.findOne({
      where: { id },
    });

    if (!existing) {
      return false;
    }

    await this.repo.remove(existing);
    return true;
  }
}
