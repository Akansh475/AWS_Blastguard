import { impactAnalysisService, ImpactAnalysisResult, ImpactAnalysisService } from '../services/ImpactAnalysisService';
import { logger } from '../utils/logger';

export interface IImpactAgent {
  name: string;
  execute(resourceId: string): Promise<ImpactAnalysisResult>;
}

export class ImpactAgent implements IImpactAgent {
  name = 'ImpactAgent';
  private service: ImpactAnalysisService;

  constructor(service?: ImpactAnalysisService) {
    this.service = service || impactAnalysisService;
  }

  async execute(resourceId: string): Promise<ImpactAnalysisResult> {
    logger.info(`[${this.name}] Calculating deterministic impact metrics for ${resourceId}`);
    return this.service.analyzeImpact(resourceId);
  }
}

export const impactAgent = new ImpactAgent();
