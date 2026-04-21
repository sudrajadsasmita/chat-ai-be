import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database/database.config';
import { RestModule } from './adapters/inbound/rest/rest.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerModule } from './common/interceptors/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.production',
        '.env',
      ],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    LoggerModule,
    RestModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
