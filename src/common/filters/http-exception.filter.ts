import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string = exception.message;
    const errors: Record<string, string[]> = {};

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as Record<string, any>;

      if (Array.isArray(resObj['message'])) {
        message = 'The given data was invalid.';

        resObj['message'].forEach((msg: string) => {
          const [field, ...rest] = msg.split(' ');
          if (!errors[field]) errors[field] = [];
          errors[field].push(rest.join(' '));
        });
      } else if (typeof resObj['message'] === 'string') {
        message = resObj['message'];
      }
    }

    response.status(status).json({
      status: 'failed',
      message,
      ...(Object.keys(errors).length > 0 ? { errors } : {}),
    });
  }
}
