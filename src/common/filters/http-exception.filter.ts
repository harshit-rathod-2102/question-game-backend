import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorDetail {
  field: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: ErrorDetail[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        details = [{ field: 'general', message: exceptionResponse }];
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          details = responseObj.message.map((msg: string) => ({
            field: 'validation',
            message: msg,
          }));
        } else {
          message = (responseObj.message as string) || message;
          details = [{ field: 'general', message }];
        }

        // Handle specific error types
        if (responseObj.error) {
          message = responseObj.error as string;
        }
      }
    } else if (exception instanceof Error) {
      // Handle generic errors
      message = exception.message || 'An unexpected error occurred';
      details = [{ field: 'general', message }];
    }

    // Map common error messages to user-friendly messages
    const userFriendlyMessage = this.getUserFriendlyMessage(status, message);

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message: userFriendlyMessage,
        details: details.length > 0 ? details : [{ field: 'general', message: userFriendlyMessage }],
        timestamp: new Date().toISOString(),
      },
    });
  }

  private getUserFriendlyMessage(status: number, originalMessage: string): string {
    // Map status codes to user-friendly messages
    const statusMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Authentication failed. Please login again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: originalMessage, // Conflict - keep original (e.g., "Email already registered")
      422: 'Invalid data provided. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
    };

    // If original message is specific, use it
    if (originalMessage && originalMessage !== 'Internal server error') {
      return originalMessage;
    }

    return statusMessages[status] || originalMessage;
  }
}
