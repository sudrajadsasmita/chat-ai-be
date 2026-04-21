import { User } from 'src/domain/entity/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: Partial<User>): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(
    search?: string,
    filter?: Record<string, any>,
  ): Promise<User[]>;
  abstract findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    filter?: Record<string, any>,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }>;
  abstract update(id: string, data: Partial<User>): Promise<User | null>;
  abstract delete(id: string): Promise<boolean>;
}
