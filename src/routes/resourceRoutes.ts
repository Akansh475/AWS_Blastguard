import { Router } from 'express';
import {
  getResourceByIdHandler,
  getResourceDependenciesHandler,
  listResourcesHandler,
} from '../handlers/resourceHandler';

export const resourceRouter = Router();

// GET /api/resources - List all discovered/mock resources
resourceRouter.get('/resources', listResourcesHandler);

// GET /api/resources/:resourceId - Get a single resource by ID
resourceRouter.get('/resources/:resourceId', getResourceByIdHandler);

// GET /api/resources/:resourceId/dependencies - Get direct dependencies for resource
resourceRouter.get('/resources/:resourceId/dependencies', getResourceDependenciesHandler);
