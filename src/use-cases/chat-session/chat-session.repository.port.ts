import { ChatSession } from 'src/domain/entity/chat-session.entity';

export abstract class ChatSessionRepositoryPort {
  abstract get(id: string): Promise<ChatSession[]>;
  abstract show(id: string): Promise<ChatSession | null>;
  abstract save(data: Partial<ChatSession>): Promise<ChatSession>;
  abstract delete(id: string): Promise<boolean>;
}
