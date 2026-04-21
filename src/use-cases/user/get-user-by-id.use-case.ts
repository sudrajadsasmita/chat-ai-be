import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException({
        status: 'failed',
        message: `User with id ${id} not found`,
      });
    }

    return user;
  }
}
