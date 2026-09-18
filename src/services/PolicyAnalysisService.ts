import { ChangeAction } from '../models/ChangeRequest';
import { PolicyViolation } from '../models/PolicyViolation';
import { dependencyAnalysisService, DependencyAnalysisService } from './DependencyAnalysisService';
import { logger } from '../utils/logger';

export interface PolicyAnalysisResult {
  resourceId: string;
  passed: boolean;
  violations: PolicyViolation[];
  violationsCount: number;
}

export class PolicyAnalysisService {
  private dependencyService: DependencyAnalysisService;

  constructor(dependencyService?: DependencyAnalysisService) {
    this.dependencyService = dependencyService || dependencyAnalysisService;
  }

  /**
   * Evaluates organizational and compliance governance policies:
   * POLICY-001: Production infrastructure changes require approval.
   * POLICY-002: Critical resources cannot be deleted automatically.
   * POLICY-003: Resources with critical downstream dependencies require review.
   * POLICY-004: Changes affecting external dependencies require additional approval.
   */
  async evaluatePolicies(
    resourceId: string,
    action: ChangeAction = 'DELETE'
  ): Promise<PolicyAnalysisResult> {
    logger.info(`PolicyAnalysisService: Evaluating policies for ${action} on ${resourceId}`);

    const analysis = await this.dependencyService.analyzeDependencies(resourceId);
    const rootResource = analysis.rootResource;
    const violations: PolicyViolation[] = [];

    // POLICY-001: Production infrastructure changes require approval.
    const isProduction =
      rootResource.environment === 'PRODUCTION' ||
      analysis.totalAffectedResources.some((r) => r.environment === 'PRODUCTION');

    if (isProduction) {
      violations.push({
        policyId: 'POLICY-001',
        policyName: 'Production Change Governance',
        severity: 'HIGH',
        message: `Production infrastructure changes require formal approval before application. Target ${rootResource.id} is in PRODUCTION.`,
        resourceId: rootResource.id,
        nonCompliantResource: rootResource.id,
      });
    }

    // POLICY-002: Critical resources cannot be deleted automatically.
    const isCritical = rootResource.criticality === 'CRITICAL';
    const isDelete = action === 'DELETE';

    if (isDelete && isCritical) {
      violations.push({
        policyId: 'POLICY-002',
        policyName: 'Critical Resource Deletion Guardrail',
        severity: 'CRITICAL',
        message: `Critical resource ${rootResource.id} (${rootResource.type}) cannot be deleted automatically. Manual change approval required.`,
        resourceId: rootResource.id,
        nonCompliantResource: rootResource.id,
      });
    }

    // POLICY-003: Resources with critical downstream dependencies require review.
    if (analysis.criticalServices.length > 0) {
      const serviceNames = analysis.criticalServices.map((s) => s.name).join(', ');
      violations.push({
        policyId: 'POLICY-003',
        policyName: 'Critical Dependency Review Guardrail',
        severity: 'CRITICAL',
        message: `Changes to ${rootResource.id} affect ${analysis.criticalServices.length} critical downstream service(s) (${serviceNames}) and require mandatory architectural review.`,
        resourceId: rootResource.id,
        nonCompliantResource: rootResource.id,
      });
    }

    // POLICY-004: Changes affecting external dependencies require additional approval.
    if (analysis.externalDependencies.length > 0) {
      const extNames = analysis.externalDependencies.map((e) => e.name).join(', ');
      violations.push({
        policyId: 'POLICY-004',
        policyName: 'External Attack Surface & Dependency Protection',
        severity: 'HIGH',
        message: `Changes to ${rootResource.id} affect ${analysis.externalDependencies.length} external-facing dependency(ies) (${extNames}) and require external gateway approval.`,
        resourceId: rootResource.id,
        nonCompliantResource: rootResource.id,
      });
    }

    const passed = violations.length === 0;

    return {
      resourceId,
      passed,
      violations,
      violationsCount: violations.length,
    };
  }
}

export const policyAnalysisService = new PolicyAnalysisService();
