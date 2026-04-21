import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatMessageRepositoryPort } from './chat-message.repository.port';
import { ChatSessionRepositoryPort } from '../chat-session/chat-session.repository.port';
import { MessageRole } from 'src/adapters/shared/enums';
import OpenAI from 'openai';

type SSEMessage = {
  data: string;
};

@Injectable()
export class StreamChatUseCase {
  constructor(
    private readonly chatMessageRepository: ChatMessageRepositoryPort,
    private readonly chatSessionRepository: ChatSessionRepositoryPort,
    @Inject('OPENAI_CLIENT')
  private readonly openai: OpenAI,
  ) {}

  execute(sessionId: string): Observable<SSEMessage> {
    return new Observable((observer) => {
      const run = async () => {
        try {
          const session = await this.chatSessionRepository.show(sessionId);

          if (!session) {
            observer.error(
              new NotFoundException('Chat session tidak ditemukan'),
            );
            return;
          }

          const lastMessage = session.messages?.at(-1);

          if (!lastMessage) {
            observer.complete();
            return;
          }

          // 🔥 STREAM KE OPENAI
          const stream = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: lastMessage.content,
              },
            ],
            stream: true,
          });

          let fullText = '';

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              fullText += content;

              observer.next({
                data: content,
              });
            }
          }

          // ✅ simpan hasil akhir
          await this.chatMessageRepository.sendMessage({
            session_id: sessionId,
            role: MessageRole.AI,
            content: fullText,
          });

          observer.next({ data: '[DONE]' });
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      };

      run();
    });
  }
}