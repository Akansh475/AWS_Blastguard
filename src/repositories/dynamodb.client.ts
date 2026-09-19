import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from '../config';

/**
 * Creates and configures the DynamoDB Document Client.
 * Uses standard AWS credential provider chain (IAM role in AWS Lambda, env vars, etc.).
 * Supports local DynamoDB endpoint override if configured.
 */
export function createDynamoDBClient(): DynamoDBClient {
  const clientConfig: {
    region: string;
    endpoint?: string;
  } = {
    region: config.awsRegion,
  };

  if (config.dynamoDbEndpoint) {
    clientConfig.endpoint = config.dynamoDbEndpoint;
  }

  return new DynamoDBClient(clientConfig);
}

export function createDynamoDBDocumentClient(dynamoDbClient?: DynamoDBClient): DynamoDBDocumentClient {
  const client = dynamoDbClient || createDynamoDBClient();
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });
}
