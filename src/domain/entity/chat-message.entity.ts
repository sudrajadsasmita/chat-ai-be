import { MessageRole } from 'src/adapters/shared/enums';

export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly session_id: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}
}
