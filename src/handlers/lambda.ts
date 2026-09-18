import serverless from 'serverless-http';
import { app } from '../app';

// AWS Lambda entrypoint handler for SAM / API Gateway
export const handler = serverless(app);
