import { ChangeRequest } from '../models/ChangeRequest';
import { SecurityFinding } from '../models/SecurityFinding';

export interface ISecurityAgent {
  name: string;
  evaluateSecurity(request: ChangeRequest): Promise<SecurityFinding[]>;
}

export class Stage1SecurityAgentPlaceholder implements ISecurityAgent {
  name = 'SecurityAgent';

  async evaluateSecurity(_request: ChangeRequest): Promise<SecurityFinding[]> {
    // Scaffolded for Stage 2 agent expansion
    return [];
  }
}
