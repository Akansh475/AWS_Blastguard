import { Router } from 'express';
import {
  analyzeRequestHandler,
  createRequestHandler,
  getRequestByIdHandler,
  getRequestImpactHandler,
  listRequestsHandler,
} from '../handlers/requestHandler';
import { validateCreateRequestMiddleware } from '../utils/validation';

export const requestRouter = Router();

// POST /api/requests - Create a proposed change request
requestRouter.post('/requests', validateCreateRequestMiddleware, createRequestHandler);

// GET /api/requests - List all proposed change requests
requestRouter.get('/requests', listRequestsHandler);

// GET /api/requests/:requestId - Retrieve a specific change request
requestRouter.get('/requests/:requestId', getRequestByIdHandler);

// POST /api/requests/:requestId/analyze - Trigger analysis for change request
requestRouter.post('/requests/:requestId/analyze', analyzeRequestHandler);

// GET /api/requests/:requestId/impact - Retrieve impact graph for change request
requestRouter.get('/requests/:requestId/impact', getRequestImpactHandler);
