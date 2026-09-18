import { ChangeAction } from '../models/ChangeRequest';
import { FindingSeverity, SecurityFinding } from '../models/SecurityFinding';
import { PolicyViolation } from '../models/PolicyViolation';
import { dependencyAnalysisService, DependencyAnalysisService } from './DependencyAnalysisService';
import { impactAnalysisService, ImpactAnalysisService } from './ImpactAnalysisService';
import { policyAnalysisService, PolicyAnalysisService } from './PolicyAnalysisService';
import { securityAnalysisService, SecurityAnalysisService } from './SecurityAnalysisService';
import { logger } from '../utils/logger';

export interface BlastRadiusAssessment {
  resourceId: string;
  action: ChangeAction;
  directImpact: number;
  indirectImpact: number;
  totalAffected: number;
  criticalServices: number;
  externalDependencies: number;
  productionImpact: boolean;
  productionResources: number;
  securityRisk: FindingSeverity;
  securityFindings: SecurityFinding[];
  policyViolations: PolicyViolation[];
  policiesPassed: boolean;
  affectedResourceIds: string[];
  criticalServiceIds: string[];
  externalDependencyIds: string[];
  analyzedAt: string;
}

export class BlastRadiusService {
  private dependencyService: DependencyAnalysisService;
  private impactService: ImpactAnalysisService;
  private securityService: SecurityAnalysisService;
  private policyService: PolicyAnalysisService;

  constructor(
    dependencyService?: DependencyAnalysisService,
    impactService?: ImpactAnalysisService,
    securityService?: SecurityAnalysisService,
    policyService?: PolicyAnalysisService
  ) {
    this.dependencyService = dependencyService || dependencyAnalysisService;
    this.impactService = impactService || impactAnalysisService;
    this.securityService = securityService || securityAnalysisService;
    this.policyService = policyService || policyAnalysisService;
  }

  /**
   * Executes the full Stage 3 analysis pipeline:
   * ChangeRequest → ResourceProvider → Dependency analysis → Topology → Security → Impact → Policy → BlastRadius.
   * Produces directImpact, indirectImpact, totalAffected, criticalServices, externalDependencies,
   * productionImpact, securityRisk, and policyViolations completely without AI / LLM.
   */
  async assessBlastRadius(
    resourceId: string,
    action: ChangeAction = 'DELETE'
  ): Promise<BlastRadiusAssessment> {
    logger.info(`BlastRadiusService: Assessing blast radius for ${action} on ${resourceId}`);

    // 1. Dependency analysis
    const depAnalysis = await this.dependencyService.analyzeDependencies(resourceId);

    // 2. Impact analysis
    const impact = await this.impactService.analyzeImpact(resourceId);

    // 3. Security analysis
    const security = await this.securityService.analyzeSecurity(resourceId);

    // 4. Policy analysis
    const policy = await this.policyService.evaluatePolicies(resourceId, action);

    return {
      resourceId,
      action,
      directImpact: impact.directImpact,
      indirectImpact: impact.indirectImpact,
      totalAffected: impact.totalAffected,
      criticalServices: impact.criticalServices,
      externalDependencies: impact.externalDependencies,
      productionImpact: impact.productionImpact,
      productionResources: impact.productionResources,
      securityRisk: security.securityRisk,
      securityFindings: security.findings,
      policyViolations: policy.violations,
      policiesPassed: policy.passed,
      affectedResourceIds: depAnalysis.totalAffectedResources.map((r) => r.id),
      criticalServiceIds: depAnalysis.criticalServices.map((r) => r.id),
      externalDependencyIds: depAnalysis.externalDependencies.map((r) => r.id),
      analyzedAt: new Date().toISOString(),
    };
  }
}

export const blastRadiusService = new BlastRadiusService();
