import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChatMessageOrm } from 'src/infrastructure/typeorm/chat-message.entity.orm';
import { ChatSessionOrm } from 'src/infrastructure/typeorm/chat-session.entity.orm';
import { UserOrm } from 'src/infrastructure/typeorm/user.entity.orm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: configService.get<string>('DB_URL'),
    synchronize:
      configService.get<string>('APP_MODE') !== 'production' ? true : false,
    entities: [UserOrm, ChatSessionOrm, ChatMessageOrm],
  };
};
