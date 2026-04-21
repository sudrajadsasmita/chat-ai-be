import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChatSessionDto {
  @ApiPropertyOptional({
    example: 'Diskusi tentang NestJS',
    description: 'Judul chat (optional, bisa auto generate)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Apa itu dependency injection di NestJS?',
    description: 'Pesan pertama dari user',
  })
  @IsString()
  message!: string;
}
