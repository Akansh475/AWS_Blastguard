import { ChangeRequest } from '../models/changeRequest.model';
import { AnalysisResult } from '../models/analysisResult.model';
import { IInfrastructureIntelligenceProvider } from './infrastructure.provider';
import { AnalysisError } from '../models/errors.model';
import { logger } from '../utils/logger';

export interface IAnalysisOrchestrator {
  executeAnalysis(request: ChangeRequest): Promise<AnalysisResult>;
}

export class AnalysisOrchestrator implements IAnalysisOrchestrator {
  constructor(private readonly intelligenceProvider: IInfrastructureIntelligenceProvider) {}

  async executeAnalysis(request: ChangeRequest): Promise<AnalysisResult> {
    logger.info(`Starting infrastructure analysis orchestration`, {
      requestId: request.requestId,
      resourceId: request.resourceId,
      action: request.action,
      environment: request.environment,
    });

    try {
      // Coordinate with Person 1's Infrastructure Intelligence pipeline
      const result = await this.intelligenceProvider.analyzeInfrastructureChange(request);

      logger.info(`Completed infrastructure analysis orchestration`, {
        requestId: request.requestId,
        decision: result.decision,
        riskScore: result.riskScore,
        affectedResources: result.affectedResources,
      });

      return result;
    } catch (error) {
      logger.error(`Analysis orchestration failed`, error, { requestId: request.requestId });
      throw new AnalysisError(
        error instanceof Error
          ? `Infrastructure analysis failed: ${error.message}`
          : 'Infrastructure analysis failed due to an unexpected engine error'
      );
    }
  }
}
