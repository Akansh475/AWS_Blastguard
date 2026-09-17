import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { config } from './config';
import { apiRouter } from './routes';
import { NotFoundError } from './utils/errors';
import { logger } from './utils/logger';
import { sendError } from './utils/response';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());

  // Request logger
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // Mount API routes
  app.use('/api', apiRouter);

  // Root welcome / discovery
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'BlastGuard Core Infrastructure Intelligence API',
      description: 'Before you change production, know what will break.',
      stage: 1,
      endpoints: {
        health: '/api/health',
        requests: '/api/requests',
      },
    });
  });

  // 404 Handler for unmatched routes
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route '${req.method} ${req.path}' not found`));
  });

  // Centralized Error Handling Middleware
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    sendError(res, err);
  });

  return app;
}

export const app = createApp();
