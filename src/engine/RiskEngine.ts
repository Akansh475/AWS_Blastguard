import { ChangeAction } from '../models/ChangeRequest';
import { PolicyViolation } from '../models/PolicyViolation';
import { Resource } from '../models/Resource';
import { RiskBreakdown } from '../models/AnalysisResult';
import { RiskDecision } from '../models/RiskResult';
import { FindingSeverity, SecurityFinding } from '../models/SecurityFinding';
import { logger } from '../utils/logger';

export interface RiskEngineInput {
  resource: Resource;
  action: ChangeAction;
  affectedCount: number;
  criticalServicesCount: number;
  externalDependenciesCount: number;
  securityRisk: FindingSeverity;
  securityFindings: SecurityFinding[];
  policyViolations: PolicyViolation[];
}

export interface RiskEngineOutput {
  riskScore: number;
  riskBreakdown: RiskBreakdown;
  factors: string[];
}

export class RiskEngine {
  /**
   * Calculates a deterministic risk score bounded to 0–100 and produces an explainable
   * risk breakdown across dependency, criticality, security, policy, and environment dimensions.
   */
  calculateRisk(input: RiskEngineInput): RiskEngineOutput {
    logger.info(`RiskEngine: Calculating risk for ${input.action} on ${input.resource.id}`);

    const factors: string[] = [];

    // 1. Dependency Risk (Max: 25)
    // Evaluates blast radius breadth and exposure to external traffic
    let blastRadiusScore = 2;
    if (input.affectedCount >= 10) {
      blastRadiusScore = 15;
    } else if (input.affectedCount >= 5) {
      blastRadiusScore = 10;
    } else if (input.affectedCount >= 2) {
      blastRadiusScore = 5;
    }

    const externalPoints = Math.min(10, input.externalDependenciesCount * 5);
    const dependencyRisk = Math.min(25, blastRadiusScore + externalPoints);
    factors.push(
      `Dependency Risk (${dependencyRisk}/25): ${input.affectedCount} affected resources (${blastRadiusScore} pts) + ${input.externalDependenciesCount} external dependencies (${externalPoints} pts)`
    );

    // 2. Criticality Risk (Max: 25)
    // Evaluates target resource criticality + downstream critical compute services
    let targetCriticalityPoints = 1;
    if (input.resource.criticality === 'CRITICAL') {
      targetCriticalityPoints = 10;
    } else if (input.resource.criticality === 'HIGH') {
      targetCriticalityPoints = 6;
    } else if (input.resource.criticality === 'MEDIUM') {
      targetCriticalityPoints = 3;
    }

    const criticalServicesPoints = Math.min(15, input.criticalServicesCount * 5);
    const criticalityRisk = Math.min(25, targetCriticalityPoints + criticalServicesPoints);
    factors.push(
      `Criticality Risk (${criticalityRisk}/25): Target ${input.resource.criticality} (${targetCriticalityPoints} pts) + ${input.criticalServicesCount} critical services (${criticalServicesPoints} pts)`
    );

    // 3. Security Risk (Max: 20)
    // Evaluates security implications (network isolation, DB severance, public ingress, IAM)
    let securityRiskPoints = 0;
    if (input.securityRisk === 'CRITICAL') {
      securityRiskPoints = 15;
    } else if (input.securityRisk === 'HIGH') {
      securityRiskPoints = 10;
    } else if (input.securityRisk === 'MEDIUM') {
      securityRiskPoints = 5;
    }
    const securityRisk = Math.min(20, securityRiskPoints);
    factors.push(
      `Security Risk (${securityRisk}/20): Security level ${input.securityRisk} with ${input.securityFindings.length} findings`
    );

    // 4. Policy Risk (Max: 20)
    // Evaluates governance guardrail violations (5 pts per CRITICAL, 2.5 pts per HIGH, 1.5 pts per MEDIUM)
    const criticalViolations = input.policyViolations.filter((v) => v.severity === 'CRITICAL').length;
    const highViolations = input.policyViolations.filter((v) => v.severity === 'HIGH').length;
    const mediumViolations = input.policyViolations.filter((v) => v.severity === 'MEDIUM').length;

    const policyRawPoints =
      criticalViolations * 5.0 + highViolations * 2.5 + mediumViolations * 1.5;
    const policyRisk = Math.min(20, Math.round(policyRawPoints));
    factors.push(
      `Policy Risk (${policyRisk}/20): ${criticalViolations} CRITICAL violations (${criticalViolations * 5} pts) + ${highViolations} HIGH violations (${highViolations * 2.5} pts)`
    );

    // 5. Environment Risk (Max: 10)
    // Evaluates blast containment tier
    let environmentRisk = 1;
    if (input.resource.environment === 'PRODUCTION') {
      environmentRisk = 7;
    } else if (input.resource.environment === 'STAGING') {
      environmentRisk = 4;
    }
    factors.push(`Environment Risk (${environmentRisk}/10): ${input.resource.environment} tier`);

    // Normalize final score to 0–100
    const rawTotal = dependencyRisk + criticalityRisk + securityRisk + policyRisk + environmentRisk;
    const total = Math.min(100, Math.max(0, Math.round(rawTotal)));

    const riskBreakdown: RiskBreakdown = {
      dependencyRisk,
      criticalityRisk,
      securityRisk,
      policyRisk,
      environmentRisk,
      total,
    };

    return {
      riskScore: total,
      riskBreakdown,
      factors,
    };
  }

  /**
   * Helper mapping numerical score to baseline decision threshold:
   * 0–30: SAFE
   * 31–65: REVIEW
   * 66–100: BLOCK
   */
  getThresholdDecision(score: number): RiskDecision {
    if (score >= 66) return 'BLOCK';
    if (score >= 31) return 'REVIEW';
    return 'SAFE';
  }
}

export const riskEngine = new RiskEngine();
