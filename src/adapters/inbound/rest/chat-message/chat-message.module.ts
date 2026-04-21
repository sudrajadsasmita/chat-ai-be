// chat-message.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageOrm } from 'src/infrastructure/typeorm/chat-message.entity.orm';
import { ChatSessionOrm } from 'src/infrastructure/typeorm/chat-session.entity.orm';
import { ChatMessageController } from './chat-message.controller';
import { SendChatMessageUseCase } from 'src/use-cases/chat-message/send-chat-message.use-case';
import { ChatMessageRepositoryPort } from 'src/use-cases/chat-message/chat-message.repository.port';
import { ChatMessageTypeormRepository } from 'src/infrastructure/chat-message.typeorm.repository';
import { ChatSessionRepositoryPort } from 'src/use-cases/chat-session/chat-session.repository.port';
import { ChatSessionTypeormRepository } from 'src/infrastructure/chat-session.typeorm.repository';
import { StreamChatUseCase } from 'src/use-cases/chat-message/stream-chat-message.usecase';
import { OpenAIProvider } from 'src/common/providers/openai.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageOrm, ChatSessionOrm])],
  controllers: [ChatMessageController],
  providers: [
    OpenAIProvider,
    SendChatMessageUseCase,
    StreamChatUseCase,
    // 🔁 binding repository
    {
      provide: ChatMessageRepositoryPort,
      useClass: ChatMessageTypeormRepository,
    },
    {
      provide: ChatSessionRepositoryPort,
      useClass: ChatSessionTypeormRepository,
    },
  ],
})
export class ChatMessageModule {}
