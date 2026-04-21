import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
import { ChatMessageModule } from './chat-message/chat-message.module';

@Module({
  imports: [AuthModule, UserModule, ChatSessionModule, ChatMessageModule],
})
export class RestModule {}
