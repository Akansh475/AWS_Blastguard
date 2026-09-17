import { ChangeRequest } from '../models/ChangeRequest';
import { PolicyViolation } from '../models/PolicyViolation';

export interface IPolicyAgent {
  name: string;
  checkPolicies(request: ChangeRequest): Promise<PolicyViolation[]>;
}

export class Stage1PolicyAgentPlaceholder implements IPolicyAgent {
  name = 'PolicyAgent';

  async checkPolicies(_request: ChangeRequest): Promise<PolicyViolation[]> {
    // Scaffolded for Stage 2 agent expansion
    return [];
  }
}
