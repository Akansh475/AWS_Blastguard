import { Response } from 'express';
import { AppError } from './errors';
import { logger } from './logger';

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  const body: ApiResponse<T> = { data };
  if (meta) {
    body.meta = meta;
  }
  res.status(statusCode).json(body);
}

export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(error.toResponse());
    return;
  }

  logger.error('Unhandled server exception', error);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred',
    },
  });
}
