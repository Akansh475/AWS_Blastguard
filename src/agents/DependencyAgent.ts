import { dependencyAnalysisService, DependencyAnalysisResult, DependencyAnalysisService } from '../services/DependencyAnalysisService';
import { logger } from '../utils/logger';

export interface IDependencyAgent {
  name: string;
  execute(resourceId: string): Promise<DependencyAnalysisResult>;
}

export class DependencyAgent implements IDependencyAgent {
  name = 'DependencyAgent';
  private service: DependencyAnalysisService;

  constructor(service?: DependencyAnalysisService) {
    this.service = service || dependencyAnalysisService;
  }

  async execute(resourceId: string): Promise<DependencyAnalysisResult> {
    logger.info(`[${this.name}] Executing deterministic dependency discovery for ${resourceId}`);
    return this.service.analyzeDependencies(resourceId);
  }
}

export const dependencyAgent = new DependencyAgent();
