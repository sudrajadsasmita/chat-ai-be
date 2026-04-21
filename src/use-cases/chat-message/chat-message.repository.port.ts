import { ChatMessage } from 'src/domain/entity/chat-message.entity';

export abstract class ChatMessageRepositoryPort {
  abstract sendMessage(data: Partial<ChatMessage>): Promise<ChatMessage>;
}
