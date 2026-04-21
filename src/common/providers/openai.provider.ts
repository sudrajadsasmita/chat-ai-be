// openai.provider.ts
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OpenAIProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new OpenAI({
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    });
  },
  inject: [ConfigService],
};