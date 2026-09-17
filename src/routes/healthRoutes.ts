import { Router } from 'express';
import { getHealthHandler } from '../handlers/healthHandler';

export const healthRouter = Router();

// GET /api/health
healthRouter.get('/health', getHealthHandler);
