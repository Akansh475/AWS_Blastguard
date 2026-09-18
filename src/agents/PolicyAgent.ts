import { ChangeAction, ChangeRequest } from '../models/ChangeRequest';
import { PolicyViolation } from '../models/PolicyViolation';
import { policyAnalysisService, PolicyAnalysisResult, PolicyAnalysisService } from '../services/PolicyAnalysisService';
import { logger } from '../utils/logger';

export interface IPolicyAgent {
  name: string;
  execute(resourceId: string, action?: ChangeAction): Promise<PolicyAnalysisResult>;
  checkPolicies(request: ChangeRequest): Promise<PolicyViolation[]>;
}

export class PolicyAgent implements IPolicyAgent {
  name = 'PolicyAgent';
  private service: PolicyAnalysisService;

  constructor(service?: PolicyAnalysisService) {
    this.service = service || policyAnalysisService;
  }

  async execute(resourceId: string, action: ChangeAction = 'DELETE'): Promise<PolicyAnalysisResult> {
    logger.info(`[${this.name}] Evaluating guardrail policies for ${action} on ${resourceId}`);
    return this.service.evaluatePolicies(resourceId, action);
  }

  async checkPolicies(request: ChangeRequest): Promise<PolicyViolation[]> {
    const result = await this.execute(request.resourceId, request.action);
    return result.violations;
  }
}

export const policyAgent = new PolicyAgent();
