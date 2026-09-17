import { AnalysisResult } from '../models/AnalysisResult';
import { changeRequestService, ChangeRequestService } from './ChangeRequestService';
import { impactService, ImpactService } from './ImpactService';
import { blastRadiusService, BlastRadiusService } from './BlastRadiusService';
import { logger } from '../utils/logger';

export class AnalysisService {
  private requestService: ChangeRequestService;
  private impactSvc: ImpactService;
  private blastRadiusSvc: BlastRadiusService;

  constructor(
    requestService?: ChangeRequestService,
    impactSvc?: ImpactService,
    blastRadiusSvc?: BlastRadiusService
  ) {
    this.requestService = requestService || changeRequestService;
    this.impactSvc = impactSvc || impactService;
    this.blastRadiusSvc = blastRadiusSvc || blastRadiusService;
  }

  async runPlaceholderAnalysis(requestId: string): Promise<AnalysisResult> {
    logger.info(`AnalysisService: Executing infrastructure analysis for request: ${requestId}`);

    const request = await this.requestService.getRequestById(requestId);

    // 1. Compute topology impact
    const impactGraph = await this.impactSvc.calculateImpact(request.resourceId);

    // 2. Compute Stage 3 blast radius, security, and policy analysis
    const assessment = await this.blastRadiusSvc.assessBlastRadius(
      request.resourceId,
      request.action
    );

    // Initial risk level derived from policy violations and security risk
    const hasCriticalPolicy = assessment.policyViolations.some((v) => v.severity === 'CRITICAL');
    const decision = hasCriticalPolicy ? 'BLOCK' : assessment.policiesPassed ? 'SAFE' : 'REVIEW';
    const status = decision === 'BLOCK' ? 'BLOCKED' : decision === 'REVIEW' ? 'REVIEW' : 'SAFE';
    const riskScore = Math.min(
      assessment.totalAffected * 6 +
        assessment.criticalServices * 12 +
        assessment.externalDependencies * 10 +
        (assessment.productionImpact ? 15 : 0),
      95
    );
    const riskLevel =
      riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

    const recommendations: string[] = [];
    if (!assessment.policiesPassed) {
      assessment.policyViolations.forEach((v) => {
        recommendations.push(`[${v.policyId}] Resolve: ${v.message}`);
      });
    }
    if (assessment.externalDependencies > 0) {
      recommendations.push(
        `Coordinate maintenance windows for ${assessment.externalDependencies} external dependencies: ${assessment.externalDependencyIds.join(', ')}.`
      );
    }
    if (assessment.criticalServices > 0) {
      recommendations.push(
        `Architectural review mandatory for ${assessment.criticalServices} critical services: ${assessment.criticalServiceIds.join(', ')}.`
      );
    }

    const result: AnalysisResult = {
      id: `an-${requestId}`,
      requestId: request.id,
      status,
      decision,
      riskScore,
      riskLevel,
      blastRadius: assessment.totalAffected,
      impactGraph,
      securityFindings: assessment.securityFindings,
      policyViolations: assessment.policyViolations,
      summary: `Deterministic analysis for ${request.action} on ${request.resourceType} (${request.resourceId}) in ${request.environment}. Total affected: ${assessment.totalAffected}, critical services: ${assessment.criticalServices}, external dependencies: ${assessment.externalDependencies}, security risk: ${assessment.securityRisk}. Policy violations: ${assessment.policyViolations.length}.`,
      recommendations,
      analyzedAt: new Date().toISOString(),
      metadata: {
        stage: 3,
        productionImpact: assessment.productionImpact,
        securityRisk: assessment.securityRisk,
        policiesPassed: assessment.policiesPassed,
      },
    };

    // Update the request status
    await this.requestService.updateRequestStatus(requestId, result.status);

    return result;
  }
}

export const analysisService = new AnalysisService();
