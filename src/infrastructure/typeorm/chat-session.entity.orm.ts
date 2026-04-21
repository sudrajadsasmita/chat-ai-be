import { ChatSession } from 'src/domain/entity/chat-session.entity';

import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserOrm } from './user.entity.orm';
import { ChatMessageOrm } from './chat-message.entity.orm';

@Entity({ name: 'chat_sessions' })
export class ChatSessionOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'title', type: 'text', nullable: true })
  title!: string | null;

  @ManyToOne(() => UserOrm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrm;

  @Column({ name: 'user_id' })
  user_id!: string;

  @OneToMany(() => ChatMessageOrm, (message) => message.session, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages?: ChatMessageOrm[];

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

  // 🔁 DOMAIN → ORM
  static fromDomain(entity: ChatSession): ChatSessionOrm {
    const orm = new ChatSessionOrm();
    orm.id = entity.id;
    orm.user_id = entity.user_id;
    orm.title = entity.title;
    orm.messages = entity.messages
      ? ChatMessageOrm.fromDomainList(entity.messages)
      : [];
    orm.created_at = entity.created_at;
    orm.updated_at = entity.updated_at;
    return orm;
  }

  // 🔁 ORM → DOMAIN
  toDomain(): ChatSession {
    return new ChatSession(
      this.id,
      this.user_id,
      this.title,
      this.messages?.map((message) => message.toDomain()),
      this.created_at,
      this.updated_at,
    );
  }

  static fromDomainList(sessions: ChatSession[]): ChatSessionOrm[] {
    return sessions.map((sessions) => ChatSessionOrm.fromDomain(sessions));
  }
}
