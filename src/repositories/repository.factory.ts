import { IRequestRepository, InMemoryRequestRepository } from './request.repository';
import { DynamoDBRequestRepository } from './dynamodb.request.repository';
import { createDynamoDBDocumentClient } from './dynamodb.client';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Creates the appropriate IRequestRepository based on the application mode.
 * - In 'aws' mode: uses DynamoDBRequestRepository backed by AWS DynamoDB.
 * - In 'mock' / local mode: uses InMemoryRequestRepository with pre-seeded data.
 */
export function createRequestRepository(): IRequestRepository {
  if (config.mode === 'aws') {
    logger.info(`Initializing DynamoDBRequestRepository (Table: ${config.dynamoDbTableName}, Region: ${config.awsRegion})`);
    const docClient = createDynamoDBDocumentClient();
    return new DynamoDBRequestRepository(docClient, config.dynamoDbTableName);
  }

  logger.info(`Initializing InMemoryRequestRepository (BLASTGUARD_MODE: mock)`);
  return new InMemoryRequestRepository(true);
}
