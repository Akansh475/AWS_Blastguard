import express, { Express } from 'express';
import { corsMiddleware } from '../middleware/cors.middleware';
import { requestLogger } from '../middleware/logging.middleware';
import { errorHandler } from '../middleware/error.middleware';
import { createRequestsRouter } from '../routes/requests.routes';
import { RequestsHandler } from '../handlers/requests.handler';
import { RequestService } from '../services/request.service';
import { IRequestRepository } from '../repositories/request.repository';
import { createRequestRepository } from '../repositories/repository.factory';
import { AnalysisOrchestrator, IAnalysisOrchestrator } from '../orchestration/analysis.orchestrator';
import { InfrastructureIntelligenceProvider, IInfrastructureIntelligenceProvider } from '../orchestration/infrastructure.provider';

export interface AppDependencies {
  repository?: IRequestRepository;
  intelligenceProvider?: IInfrastructureIntelligenceProvider;
  orchestrator?: IAnalysisOrchestrator;
  requestService?: RequestService;
}

export function createApp(deps?: AppDependencies): Express {
  const app = express();

  // 1. Core Middlewares
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(requestLogger);

  // 2. Dependency Injection
  const repository = deps?.repository || createRequestRepository();
  const intelligenceProvider = deps?.intelligenceProvider || new InfrastructureIntelligenceProvider();
  const orchestrator = deps?.orchestrator || new AnalysisOrchestrator(intelligenceProvider);
  const requestService = deps?.requestService || new RequestService(repository, orchestrator);

  const requestsHandler = new RequestsHandler(requestService);

  // 3. Healthcheck Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      service: 'BlastGuard Application API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // 4. API Routes (Primary and v1 alias)
  const requestsRouter = createRequestsRouter(requestsHandler);
  app.use('/api/requests', requestsRouter);
  app.use('/api/v1/requests', requestsRouter);


  // 5. 404 Handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Cannot ${req.method} ${req.path}`,
      },
    });
  });

  // 6. Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
}
