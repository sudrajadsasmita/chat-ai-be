// src/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston/dist/winston.module';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info: { timestamp: string; level: string; message: string }) => {
                return `[Nest] ${process.pid} - ${info.timestamp}  [${info.level}] : ${info.message}`;
              },
            ),
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: 'info',
          filename: 'storage/logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
