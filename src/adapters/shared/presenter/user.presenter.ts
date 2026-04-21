import { User } from 'src/domain/entity/user.entity';

export class UserPresenter {
  static toResponse(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static toResponseList(users: User[]) {
    return users.map((user) => this.toResponse(user));
  }
}
