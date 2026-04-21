// chat-message.controller.ts
import { Body, Controller, Param, Post, Sse, UseGuards } from '@nestjs/common';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { MessageRole } from 'src/adapters/shared/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatMessage } from 'src/domain/entity/chat-message.entity';
import { SendChatMessageUseCase } from 'src/use-cases/chat-message/send-chat-message.use-case';
import { ShowPresenter } from 'src/adapters/shared/presenter/show.presenter';
import { Observable } from 'rxjs';
import { StreamChatUseCase } from 'src/use-cases/chat-message/stream-chat-message.usecase';
import { XAuthorGuard } from 'src/common/guards/x-author.guard';

type SSEMessage = {
  data: string;
};

@ApiTags('Chat Message')
@Controller('chat-message')
export class ChatMessageController {
  constructor(
    private readonly sendChatMessageUseCase: SendChatMessageUseCase,
    private readonly streamChatUseCase: StreamChatUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(XAuthorGuard)
  @ApiOperation({ summary: 'Kirim pesan ke chat session' })
  async sendMessage(@Body() dto: SendChatMessageDto) {
    // 🔥 paksa role USER (security)
    const result = await this.sendChatMessageUseCase.execute({
      session_id: dto.session_id,
      content: dto.content,
    });

    return ShowPresenter.toResponse(
      'Chat has been sended...',
      'success',
      result,
    );
  }

  @Sse(':sessionId/stream')
  stream(@Param('sessionId') sessionId: string): Observable<SSEMessage> {
    return this.streamChatUseCase.execute(sessionId);
  }
}
