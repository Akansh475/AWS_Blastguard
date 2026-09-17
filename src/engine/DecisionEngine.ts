import { PolicyViolation } from '../models/PolicyViolation';
import { RiskDecision, RiskLevel } from '../models/RiskResult';
import { logger } from '../utils/logger';

export interface DecisionEngineInput {
  riskScore: number;
  policyViolations: PolicyViolation[];
  factors?: string[];
}

export interface DecisionEngineOutput {
  decision: RiskDecision;
  riskScore: number;
  severity: RiskLevel;
  reasons: string[];
}

export class DecisionEngine {
  /**
   * Enforces the definitive BlastGuard decision matrix:
   * 1. If there is a critical policy violation -> BLOCK.
   * 2. Else if riskScore >= 66 -> BLOCK.
   * 3. Else if riskScore >= 31 -> REVIEW.
   * 4. Else -> SAFE.
   */
  evaluateDecision(input: DecisionEngineInput): DecisionEngineOutput {
    logger.info(`DecisionEngine: Evaluating decision for score ${input.riskScore}`);

    const reasons: string[] = [];
    const criticalViolations = input.policyViolations.filter((v) => v.severity === 'CRITICAL');
    const hasCriticalPolicy = criticalViolations.length > 0;

    let decision: RiskDecision;

    if (hasCriticalPolicy) {
      decision = 'BLOCK';
      const pIds = criticalViolations.map((v) => v.policyId).join(', ');
      reasons.push(`Mandatory BLOCK: Critical policy guardrail violation(s) detected [${pIds}].`);
    } else if (input.riskScore >= 66) {
      decision = 'BLOCK';
      reasons.push(
        `Mandatory BLOCK: Cumulative risk score of ${input.riskScore} meets or exceeds the BLOCK threshold (>=66).`
      );
    } else if (input.riskScore >= 31) {
      decision = 'REVIEW';
      reasons.push(
        `Change requires REVIEW: Risk score of ${input.riskScore} falls in the supervisory review threshold (31–65).`
      );
    } else {
      decision = 'SAFE';
      reasons.push(
        `Change is SAFE: Risk score of ${input.riskScore} is well within the low-risk threshold (0–30).`
      );
    }

    // Determine aggregate severity level
    let severity: RiskLevel;
    if (input.riskScore >= 75 || hasCriticalPolicy) {
      severity = 'CRITICAL';
    } else if (input.riskScore >= 50 || input.policyViolations.some((v) => v.severity === 'HIGH')) {
      severity = 'HIGH';
    } else if (input.riskScore >= 25) {
      severity = 'MEDIUM';
    } else {
      severity = 'LOW';
    }

    // Include additional diagnostic factors
    if (input.factors) {
      reasons.push(...input.factors);
    }

    return {
      decision,
      riskScore: input.riskScore,
      severity,
      reasons,
    };
  }
}

export const decisionEngine = new DecisionEngine();
