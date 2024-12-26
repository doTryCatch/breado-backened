// src/common/filters/unauthorized-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    // Optionally log the exception message
    console.log('Unauthorized error message:', exception.message);

    // Customize the response format
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
