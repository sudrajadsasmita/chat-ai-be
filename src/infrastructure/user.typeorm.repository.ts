import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entity/user.entity';
import { UserRepositoryPort } from 'src/use-cases/user/user.repository.port';
import { Brackets, Repository } from 'typeorm';
import { UserOrm } from './typeorm/user.entity.orm';

@Injectable()
export class UserTypeormRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrm)
    private readonly repo: Repository<UserOrm>,
  ) {}

  async save(user: Partial<User>): Promise<User> {
    const saved = await this.repo.save(this.repo.create(user));
    return saved.toDomain();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['chat_sessions'],
    });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email } });
    return user ? user.toDomain() : null;
  }

  async findAll(
    search = '',
    filter: Record<string, any> = {},
  ): Promise<User[]> {
    const query = this.repo
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'DESC');

    this.applySearchAndFilter(query, search, filter);

    const users = await query.getMany();
    return users.map((user) => user.toDomain());
  }

  async findAllPaginated(
    page: number,
    limit: number,
    search = '',
    filter: Record<string, any> = {},
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const query = this.repo
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    this.applySearchAndFilter(query, search, filter);

    const [data, total] = await query.getManyAndCount();
    return {
      data: data.map((user) => user.toDomain()),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const merged = this.repo.merge(existing, data);
    const saved = await this.repo.save(merged);
    return saved.toDomain();
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return false;
    }

    await this.repo.softRemove(existing);
    return true;
  }

  private applySearchAndFilter(
    query: ReturnType<Repository<UserOrm>['createQueryBuilder']>,
    search: string,
    filter: Record<string, any>,
  ) {
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.username) LIKE LOWER(:search)', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(user.name) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(user.email) LIKE LOWER(:search)', {
              search: `%${search}%`,
            });
        }),
      );
    }
  }
}
