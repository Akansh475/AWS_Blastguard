import { AnalysisResult } from '../models/AnalysisResult';
import { changeRequestService, ChangeRequestService } from './ChangeRequestService';
import { impactService, ImpactService } from './ImpactService';
import { logger } from '../utils/logger';

export class AnalysisService {
  private requestService: ChangeRequestService;
  private impactSvc: ImpactService;

  constructor(requestService?: ChangeRequestService, impactSvc?: ImpactService) {
    this.requestService = requestService || changeRequestService;
    this.impactSvc = impactSvc || impactService;
  }

  async runPlaceholderAnalysis(requestId: string): Promise<AnalysisResult> {
    logger.info(`AnalysisService: Starting placeholder analysis for request: ${requestId}`);

    const request = await this.requestService.getRequestById(requestId);

    // Compute topological impact
    const impactGraph = await this.impactSvc.calculateImpact(request.resourceId);

    // Placeholder deterministic score based on blast radius for Stage 1
    const baseScore = Math.min(impactGraph.blastRadiusCount * 15, 85);
    const riskLevel = baseScore >= 70 ? 'HIGH' : baseScore >= 40 ? 'MEDIUM' : 'LOW';
    const decision = riskLevel === 'HIGH' ? 'REVIEW' : 'SAFE';

    const result: AnalysisResult = {
      id: `an-${requestId}`,
      requestId: request.id,
      status: decision === 'SAFE' ? 'SAFE' : 'REVIEW',
      decision,
      riskScore: baseScore,
      riskLevel,
      blastRadius: impactGraph.blastRadiusCount,
      impactGraph,
      securityFindings: [],
      policyViolations: [],
      summary: `Stage 1 baseline analysis for ${request.action} on ${request.resourceType} (${request.resourceId}) in ${request.environment}. Direct dependencies: ${impactGraph.directImpactCount}, total blast radius: ${impactGraph.blastRadiusCount} resources.`,
      recommendations: [
        `Assess the ${impactGraph.directImpactCount} directly connected resources before executing ${request.action}.`,
        'Full Stage 2 intelligence engine with multi-agent Bedrock analysis will compute deep policy/security checks.',
      ],
      analyzedAt: new Date().toISOString(),
      metadata: {
        stage: 1,
        engineStatus: 'placeholder_active',
      },
    };

    // Update the request status
    await this.requestService.updateRequestStatus(requestId, result.status);

    return result;
  }
}

export const analysisService = new AnalysisService();
