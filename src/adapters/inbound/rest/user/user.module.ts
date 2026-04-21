import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserOrm } from 'src/infrastructure/typeorm/user.entity.orm';
import { UserTypeormRepository } from 'src/infrastructure/user.typeorm.repository';
import { UserRepositoryPort } from 'src/use-cases/user/user.repository.port';
import { ListUserPaginateUseCase } from 'src/use-cases/user/list-user-paginate.use-case';
import { ListUserUseCase } from 'src/use-cases/user/list-user.use-case';
import { GetUserByIdUseCase } from 'src/use-cases/user/get-user-by-id.use-case';
import { CreateUserUseCase } from 'src/use-cases/user/create-user.use-case';
import { UpdateUserUseCase } from 'src/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from 'src/use-cases/user/delete-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrm])],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: UserTypeormRepository,
    },
    ListUserPaginateUseCase,
    ListUserUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
