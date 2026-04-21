import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();
    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        // Log response after request is finished
        this.logger.log(
          `Response to ${method} ${url} - took ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
