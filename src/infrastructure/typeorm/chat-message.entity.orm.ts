import { ChatMessage } from 'src/domain/entity/chat-message.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ChatSessionOrm } from './chat-session.entity.orm';
import { MessageRole } from 'src/adapters/shared/enums';

@Entity({ name: 'chat_messages' })
export class ChatMessageOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ChatSessionOrm, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session!: ChatSessionOrm;

  @Column({ name: 'session_id' })
  session_id!: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role!: MessageRole;

  @Column({ type: 'text' })
  content!: string;

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
  static fromDomain(entity: ChatMessage): ChatMessageOrm {
    const orm = new ChatMessageOrm();
    orm.id = entity.id;
    orm.session_id = entity.session_id;
    orm.role = entity.role;
    orm.content = entity.content;
    orm.created_at = entity.created_at;
    orm.updated_at = entity.updated_at;
    return orm;
  }

  // 🔁 ORM → DOMAIN
  toDomain(): ChatMessage {
    return new ChatMessage(
      this.id,
      this.session_id,
      this.role,
      this.content,
      this.created_at,
      this.updated_at,
    );
  }

  static fromDomainList(message: ChatMessage[]): ChatMessageOrm[] {
    return message.map((message) => ChatMessageOrm.fromDomain(message));
  }
}
