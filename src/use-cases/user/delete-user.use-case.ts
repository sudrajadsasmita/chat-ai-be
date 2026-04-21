import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<boolean> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException({
        status: 'failed',
        message: `User with id ${id} not found`,
      });
    }

    return true;
  }
}
