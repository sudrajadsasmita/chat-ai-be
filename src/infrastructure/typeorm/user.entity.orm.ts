import { User } from 'src/domain/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatSessionOrm } from './chat-session.entity.orm';
@Entity({
  name: 'm_user',
})
export class UserOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'email', unique: true })
  email!: string;

  @Column({ name: 'password' })
  password!: string;

  @OneToMany(() => ChatSessionOrm, (session) => session.user)
  chat_sessions?: ChatSessionOrm[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deleted_at!: Date | null;

  static fromDomain(user: User): UserOrm {
    const orm = new UserOrm();
    orm.name = user.name;
    orm.email = user.email;
    orm.password = user.password;
    return orm;
  }

  toDomain(): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.chat_sessions?.map((session) => session.toDomain()),
      this.created_at,
      this.updated_at,
    );
  }
}
