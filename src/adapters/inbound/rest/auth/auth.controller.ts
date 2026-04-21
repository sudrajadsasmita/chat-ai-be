import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { XAuthorGuard } from 'src/common/guards/x-author.guard';
import { LoginUseCase } from 'src/use-cases/auth/login.use-case';
import { RegisterUseCase } from 'src/use-cases/auth/register.use-case';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthorizedUser } from 'src/domain/entity/authorized-token.entity';

@ApiTags('Auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUseCase.execute(dto);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('me')
  @UseGuards(XAuthorGuard)
  @ApiBearerAuth()
  me(@Req() request: Request & { user?: AuthorizedUser }) {
    return {
      status: 'success',
      message: 'Authenticated user retrieved successfully',
      data: request.user ?? null,
    };
  }
}
