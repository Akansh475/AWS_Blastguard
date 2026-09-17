import { AnalysisResult } from '../models/AnalysisResult';
import { ChangeRequest } from '../models/ChangeRequest';
import { ImpactGraph } from '../models/ImpactGraph';
import { RiskResult } from '../models/RiskResult';
import { supervisorAgent, SupervisorAgent } from '../agents/SupervisorAgent';

/**
 * Interface defining the Analysis Engine contract.
 */
export interface IAnalysisEngine {
  analyze(request: ChangeRequest, impact?: ImpactGraph): Promise<AnalysisResult>;
  evaluateRisk(request: ChangeRequest, impact: ImpactGraph): Promise<RiskResult>;
}

export class ProductionAnalysisEngine implements IAnalysisEngine {
  private supervisor: SupervisorAgent;

  constructor(supervisorInstance?: SupervisorAgent) {
    this.supervisor = supervisorInstance || supervisorAgent;
  }

  async analyze(request: ChangeRequest, _impact?: ImpactGraph): Promise<AnalysisResult> {
    return this.supervisor.orchestrateAnalysis(request);
  }

  async evaluateRisk(request: ChangeRequest, impact: ImpactGraph): Promise<RiskResult> {
    const analysis = await this.supervisor.orchestrateAnalysis(request);
    return {
      score: analysis.riskScore,
      level: analysis.severity,
      decision: analysis.decision,
      factors: analysis.reasons,
      blastRadius: impact.blastRadiusCount,
    };
  }
}

export const analysisEngine = new ProductionAnalysisEngine();
// Alias for backwards compatibility
export const Stage1PlaceholderEngine = ProductionAnalysisEngine;
