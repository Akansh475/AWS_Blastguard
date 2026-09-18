import { ChangeRequest } from '../models/ChangeRequest';
import { SecurityFinding } from '../models/SecurityFinding';
import { securityAnalysisService, SecurityAnalysisResult, SecurityAnalysisService } from '../services/SecurityAnalysisService';
import { logger } from '../utils/logger';

export interface ISecurityAgent {
  name: string;
  execute(resourceId: string): Promise<SecurityAnalysisResult>;
  evaluateSecurity(request: ChangeRequest): Promise<SecurityFinding[]>;
}

export class SecurityAgent implements ISecurityAgent {
  name = 'SecurityAgent';
  private service: SecurityAnalysisService;

  constructor(service?: SecurityAnalysisService) {
    this.service = service || securityAnalysisService;
  }

  async execute(resourceId: string): Promise<SecurityAnalysisResult> {
    logger.info(`[${this.name}] Executing deterministic security analysis for ${resourceId}`);
    return this.service.analyzeSecurity(resourceId);
  }

  async evaluateSecurity(request: ChangeRequest): Promise<SecurityFinding[]> {
    const result = await this.execute(request.resourceId);
    return result.findings;
  }
}

export const securityAgent = new SecurityAgent();
