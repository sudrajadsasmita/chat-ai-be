// dto/send-chat-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { MessageRole } from 'src/adapters/shared/enums';

export class SendChatMessageDto {
  @ApiProperty({
    example: 'uuid-session-id',
    description: 'ID chat session',
  })
  @IsUUID()
  session_id!: string;

  @ApiProperty({
    example: 'Halo, jelaskan tentang clean architecture',
    description: 'Isi pesan',
  })
  @IsString()
  content!: string;
}
