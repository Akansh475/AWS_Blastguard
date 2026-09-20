import serverless from 'serverless-http';
import { createApp } from './server';

const app = createApp();

export const handler = serverless(app);
