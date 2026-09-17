import { AnalysisResult } from '../models/AnalysisResult';
import { ChangeRequest } from '../models/ChangeRequest';
import { ImpactGraph } from '../models/ImpactGraph';
import { RiskResult } from '../models/RiskResult';

/**
 * Interface defining the Stage 2 Analysis Engine contract.
 * Future modules (Person 1 Stage 2) will implement the deterministic scoring,
 * policy evaluation, and security rule evaluation behind this contract.
 */
export interface IAnalysisEngine {
  analyze(request: ChangeRequest, impact: ImpactGraph): Promise<AnalysisResult>;
  evaluateRisk(request: ChangeRequest, impact: ImpactGraph): Promise<RiskResult>;
}

export class Stage1PlaceholderEngine implements IAnalysisEngine {
  async analyze(request: ChangeRequest, impact: ImpactGraph): Promise<AnalysisResult> {
    const risk = await this.evaluateRisk(request, impact);

    return {
      id: `an-engine-${request.id}`,
      requestId: request.id,
      status: risk.decision === 'BLOCK' ? 'BLOCKED' : risk.decision === 'REVIEW' ? 'REVIEW' : 'SAFE',
      decision: risk.decision,
      riskScore: risk.score,
      riskLevel: risk.level,
      blastRadius: impact.blastRadiusCount,
      impactGraph: impact,
      securityFindings: [],
      policyViolations: [],
      summary: `Analysis engine foundation initialized for ${request.id}. Stage 2 will execute multi-agent rules.`,
      recommendations: [
        'Perform dependency review on connected resources.',
        'Stage 2 intelligence engine will provide automated guardrail verification.',
      ],
      analyzedAt: new Date().toISOString(),
      metadata: {
        engine: 'Stage1PlaceholderEngine',
      },
    };
  }

  async evaluateRisk(request: ChangeRequest, impact: ImpactGraph): Promise<RiskResult> {
    const isProduction = request.environment === 'PRODUCTION';
    const isDelete = request.action === 'DELETE';
    let score = impact.blastRadiusCount * 10;

    if (isProduction) score += 20;
    if (isDelete) score += 15;

    score = Math.min(Math.max(score, 0), 100);

    const level = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';
    const decision = score >= 75 ? 'BLOCK' : score >= 40 ? 'REVIEW' : 'SAFE';

    return {
      score,
      level,
      decision,
      factors: [
        `Action: ${request.action}`,
        `Environment: ${request.environment}`,
        `Blast radius: ${impact.blastRadiusCount} resources`,
      ],
      blastRadius: impact.blastRadiusCount,
    };
  }
}
