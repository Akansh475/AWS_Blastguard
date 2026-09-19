import { Router } from 'express';
import { RequestsHandler } from '../handlers/requests.handler';

export function createRequestsRouter(handler: RequestsHandler): Router {
  const router = Router();

  // POST /api/requests - Create Change Request
  router.post('/', handler.createRequest);

  // GET /api/requests - List Change Requests
  router.get('/', handler.listRequests);

  // GET /api/requests/:requestId - Get Request Details
  router.get('/:requestId', handler.getRequest);

  // POST /api/requests/:requestId/analyze - Analyze Request
  router.post('/:requestId/analyze', handler.analyzeRequest);

  // GET /api/requests/:requestId/impact - Get Impact Graph
  router.get('/:requestId/impact', handler.getImpactGraph);

  // POST /api/requests/:requestId/explain - Generate/Retrieve AI Explanation
  router.post('/:requestId/explain', handler.generateExplanation);

  // GET /api/requests/:requestId/explanation - Retrieve AI Explanation
  router.get('/:requestId/explanation', handler.getExplanation);

  return router;


}
