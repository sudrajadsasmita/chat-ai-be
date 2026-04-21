import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/adapters/inbound/rest/user/dto/user.dto';
import { PasswordHelper } from 'src/adapters/shared/helpers/password.helper';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('Email sudah digunakan');
    }

    return this.userRepository.save({
      name: dto.name,
      email: dto.email,
      password: await PasswordHelper.hash(dto.password),
    });
  }
}
