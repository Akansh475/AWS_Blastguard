import { Request, Response, NextFunction } from 'express';
import { AppError } from '../models/errors.model';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const requestId = (req.params?.requestId as string) || (req.body?.requestId as string) || 'N/A';

  if (err instanceof AppError) {
    logger.warn(`Handled application error [${err.code}]: ${err.message}`, {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
      requestId,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Unhandled / Unexpected Errors
  logger.error(`Unhandled server error on ${req.method} ${req.path}`, err, { requestId });

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
  });
}
