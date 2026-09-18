import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info('====================================================');
  logger.info('  BLASTGUARD - Core Infrastructure Safety System    ');
  logger.info('  "Before you change production, know what will break."');
  logger.info('====================================================');
  logger.info(`Mode:        ${config.mode.toUpperCase()}`);
  logger.info(`Region:      ${config.awsRegion}`);
  logger.info(`Frontend:    ${config.frontendUrl}`);
  logger.info(`Server:      http://localhost:${config.port}`);
  logger.info(`Health check: http://localhost:${config.port}/api/health`);
  logger.info(`Requests API: http://localhost:${config.port}/api/requests`);
  logger.info('====================================================');
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
