import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListPresenter } from 'src/adapters/shared/presenter/list.presenter';
import { PaginatePresenter } from 'src/adapters/shared/presenter/paginate.presenter';
import { ShowPresenter } from 'src/adapters/shared/presenter/show.presenter';
import { UserPresenter } from 'src/adapters/shared/presenter/user.presenter';
import { Roles } from 'src/common/decorators/roles.decorator';
import { XAuthorGuard } from 'src/common/guards/x-author.guard';
import { DeleteUserUseCase } from 'src/use-cases/user/delete-user.use-case';
import { GetUserByIdUseCase } from 'src/use-cases/user/get-user-by-id.use-case';
import { ListUserPaginateUseCase } from 'src/use-cases/user/list-user-paginate.use-case';
import { ListUserUseCase } from 'src/use-cases/user/list-user.use-case';
import { CreateUserUseCase } from 'src/use-cases/user/create-user.use-case';
import { UpdateUserUseCase } from 'src/use-cases/user/update-user.use-case';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller({
  path: 'user',
})
@UseGuards(XAuthorGuard)
export class UserController {
  constructor(
    private readonly listUserPaginateUseCase: ListUserPaginateUseCase,
    private readonly listUserUseCase: ListUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async paginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filter: Record<string, string> = {},
  ) {
    try {
      delete filter.page;
      delete filter.limit;

      const users = await this.listUserPaginateUseCase.execute(
        +page,
        +limit,
        '',
        filter,
      );

      return PaginatePresenter.toResponse(
        'Data USER retrieved successfully',
        'success',
        UserPresenter.toResponseList(users.data),
        users.total,
        users.page,
        users.limit,
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

  @Get('list')
  async list(@Query() filter: Record<string, string> = {}) {
    try {
      delete filter.search;
      const users = await this.listUserUseCase.execute('', filter);

      return ListPresenter.toResponse(
        'Data USER retrieved successfully',
        'success',
        UserPresenter.toResponseList(users),
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

  @Get('show/:id')
  async show(@Param('id') id: string) {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      return ShowPresenter.toResponse(
        'Data USER retrieved successfully',
        'success',
        UserPresenter.toResponse(user),
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

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.createUserUseCase.execute(dto);
      return ShowPresenter.toResponse(
        'Data USER created successfully',
        'success',
        UserPresenter.toResponse(user),
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

  @Put(':id/update')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.updateUserUseCase.execute(id, dto);
      return ShowPresenter.toResponse(
        'Data USER updated successfully',
        'success',
        UserPresenter.toResponse(user),
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deleted = await this.deleteUserUseCase.execute(id);
      return ShowPresenter.toResponse(
        'Data USER deleted successfully',
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
