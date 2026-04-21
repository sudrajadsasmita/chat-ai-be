import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListPresenter } from 'src/adapters/shared/presenter/list.presenter';
import { ShowPresenter } from 'src/adapters/shared/presenter/show.presenter';
import { XAuthorGuard } from 'src/common/guards/x-author.guard';
import { CreateChatSessionUseCase } from 'src/use-cases/chat-session/create-chat-session.use-case';
import { DeleteChatSessionUseCase } from 'src/use-cases/chat-session/delete-chat-session.use-case';
import { GetChatSessionUseCase } from 'src/use-cases/chat-session/get-chat-session.use-case';
import { ShowChatSessionUseCase } from 'src/use-cases/chat-session/show-chat-session.use-case';
import { MessageRole } from 'src/adapters/shared/enums';
import { CreateChatSessionDto } from './dto/create-chat.dto';
import { AuthorizedUser } from 'src/domain/entity/authorized-token.entity';

@ApiTags('Chat Session')
@ApiBearerAuth()
@Controller({
  path: 'chat-session',
})
@UseGuards(XAuthorGuard)
export class ChatSessionController {
  constructor(
    private readonly createChatSessionUseCase: CreateChatSessionUseCase,
    private readonly deleteChatSessionUseCase: DeleteChatSessionUseCase,
    private readonly getChatSessionUseCase: GetChatSessionUseCase,
    private readonly showChatSessionUseCase: ShowChatSessionUseCase,
  ) {}

  // ✅ GET LIST
  @Get()
  async list(@Req() request: Request & { user?: AuthorizedUser }) {
    try {
      const sessions = await this.getChatSessionUseCase.execute(
        String(request.user?.sub),
      );

      return ListPresenter.toResponse(
        'Data CHAT SESSION retrieved successfully',
        'success',
        sessions,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ GET DETAIL
  @Get('show/:id')
  async show(@Param('id') id: string) {
    try {
      const session = await this.showChatSessionUseCase.execute(id);

      return ShowPresenter.toResponse(
        'Data CHAT SESSION retrieved successfully',
        'success',
        session,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.NOT_FOUND,
      );
    }
  }

  // ✅ CREATE (SESSION + FIRST MESSAGE)
  @Post()
  async create(
    @Req() request: Request & { user?: AuthorizedUser },
    @Body() dto: CreateChatSessionDto,
  ) {
    try {
      const session = await this.createChatSessionUseCase.execute({
        user_id: request.user?.sub,
        title: dto.title ?? null,
        messages: [
          {
            content: dto.message,
            role: MessageRole.USER,
          } as any, // 🔥 sementara karena domain kamu belum clean
        ],
      });

      return ShowPresenter.toResponse(
        'Chat session created successfully',
        'success',
        session,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ✅ DELETE
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deleted = await this.deleteChatSessionUseCase.execute(id);

      return ShowPresenter.toResponse(
        'Chat session deleted successfully',
        'success',
        deleted,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.NOT_FOUND,
      );
    }
  }
}
