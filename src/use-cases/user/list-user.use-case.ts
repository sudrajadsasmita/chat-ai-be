import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class ListUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    search: string,
    filter: Record<string, any> = {},
  ): Promise<User[]> {
    return this.userRepository.findAll(search, filter);
  }
}
