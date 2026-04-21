import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrm } from 'src/infrastructure/typeorm/user.entity.orm';
import { UserTypeormRepository } from 'src/infrastructure/user.typeorm.repository';
import { UserRepositoryPort } from 'src/use-cases/user/user.repository.port';
import { ChatSessionController } from './chat-session.controller';
import { ChatSessionOrm } from 'src/infrastructure/typeorm/chat-session.entity.orm';
import { ChatMessageOrm } from 'src/infrastructure/typeorm/chat-message.entity.orm';
import { ChatSessionRepositoryPort } from 'src/use-cases/chat-session/chat-session.repository.port';
import { ChatSessionTypeormRepository } from 'src/infrastructure/chat-session.typeorm.repository';
import { GetChatSessionUseCase } from 'src/use-cases/chat-session/get-chat-session.use-case';
import { ShowChatSessionUseCase } from 'src/use-cases/chat-session/show-chat-session.use-case';
import { CreateChatSessionUseCase } from 'src/use-cases/chat-session/create-chat-session.use-case';
import { DeleteChatSessionUseCase } from 'src/use-cases/chat-session/delete-chat-session.use-case';
@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionOrm, ChatMessageOrm])],
  controllers: [ChatSessionController],
  providers: [
    {
      provide: ChatSessionRepositoryPort,
      useClass: ChatSessionTypeormRepository,
    },
    GetChatSessionUseCase,
    ShowChatSessionUseCase,
    CreateChatSessionUseCase,
    DeleteChatSessionUseCase,
  ],
})
export class ChatSessionModule {}
