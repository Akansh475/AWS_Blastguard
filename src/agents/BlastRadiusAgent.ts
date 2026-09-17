import { ChangeRequest } from '../models/ChangeRequest';
import { ImpactGraph } from '../models/ImpactGraph';

export interface IBlastRadiusAgent {
  name: string;
  analyzeRadius(request: ChangeRequest): Promise<ImpactGraph>;
}

export class Stage1BlastRadiusAgentPlaceholder implements IBlastRadiusAgent {
  name = 'BlastRadiusAgent';

  async analyzeRadius(_request: ChangeRequest): Promise<ImpactGraph> {
    // Scaffolded for Stage 2 agent expansion
    return {
      rootResourceId: 'placeholder',
      nodes: [],
      edges: [],
      blastRadiusCount: 0,
      directImpactCount: 0,
      indirectImpactCount: 0,
    };
  }
}
