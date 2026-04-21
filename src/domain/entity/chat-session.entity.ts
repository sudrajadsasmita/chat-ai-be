import { ChatMessage } from './chat-message.entity';
import { User } from './user.entity';

export class ChatSession {
  constructor(
    public readonly id: string,
    public readonly user_id: string,
    public readonly title: string | null,
    public readonly messages: ChatMessage[] = [],
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}
}
