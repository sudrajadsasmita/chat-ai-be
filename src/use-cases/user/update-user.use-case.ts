import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/adapters/inbound/rest/user/dto/user.dto';
import { PasswordHelper } from 'src/adapters/shared/helpers/password.helper';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException({
        status: 'failed',
        message: `User with id ${id} not found`,
      });
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailOwner = await this.userRepository.findByEmail(dto.email);
      if (emailOwner) {
        throw new BadRequestException('Email sudah digunakan');
      }
    }

    const updatedUser = await this.userRepository.update(id, {
      name: dto.name ?? existingUser.name,
      email: dto.email ?? existingUser.email,
      password: dto.password
        ? await PasswordHelper.hash(dto.password)
        : existingUser.password,
    });

    if (!updatedUser) {
      throw new NotFoundException({
        status: 'failed',
        message: `User with id ${id} not found`,
      });
    }

    return updatedUser;
  }
}
