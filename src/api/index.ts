import { createApp } from './server';
import { config } from '../config';
import { logger } from '../utils/logger';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`🛡️ BlastGuard API Server is running on port ${config.port}`);
  logger.info(`Frontend URL configured as: ${config.frontendUrl}`);
  logger.info(`Health check: http://localhost:${config.port}/health`);
  logger.info(`API Base: http://localhost:${config.port}/api/requests`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

export default app;
