import dotenv from 'dotenv';

dotenv.config();

export type BlastGuardMode = 'mock' | 'aws';

export interface AppConfig {
  port: number;
  frontendUrl: string;
  nodeEnv: string;
  mode: BlastGuardMode;
  awsRegion: string;
  dynamoDbTableName: string;
  dynamoDbEndpoint?: string;
  bedrockModelId: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  mode: (process.env.BLASTGUARD_MODE?.toLowerCase() === 'aws' ? 'aws' : 'mock') as BlastGuardMode,
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || 'BlastGuardRequests',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  bedrockModelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0',
};
