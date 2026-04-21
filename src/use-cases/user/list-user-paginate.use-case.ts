import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class ListUserPaginateUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    filter: Record<string, any> = {},
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    console.log('test');
    return this.userRepository.findAllPaginated(page, limit, search, filter);
  }
}
