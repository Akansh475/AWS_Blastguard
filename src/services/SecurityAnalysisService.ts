import { FindingSeverity, SecurityFinding } from '../models/SecurityFinding';
import { dependencyAnalysisService, DependencyAnalysisService } from './DependencyAnalysisService';
import { logger } from '../utils/logger';

export interface SecurityAnalysisResult {
  resourceId: string;
  securityRisk: FindingSeverity;
  findings: SecurityFinding[];
  criticalFindingsCount: number;
  highFindingsCount: number;
  mediumFindingsCount: number;
  lowFindingsCount: number;
}

export class SecurityAnalysisService {
  private dependencyService: DependencyAnalysisService;

  constructor(dependencyService?: DependencyAnalysisService) {
    this.dependencyService = dependencyService || dependencyAnalysisService;
  }

  /**
   * Evaluates infrastructure security implications based on graph topology.
   * Analyzes production environment, critical databases, network boundaries,
   * security groups, IAM roles, public exposure, and sensitive storage.
   */
  async analyzeSecurity(resourceId: string): Promise<SecurityAnalysisResult> {
    logger.info(`SecurityAnalysisService: Analyzing security implications for ${resourceId}`);

    const analysis = await this.dependencyService.analyzeDependencies(resourceId);
    const rootResource = analysis.rootResource;
    const affected = analysis.totalAffectedResources;
    const findings: SecurityFinding[] = [];

    // 1. Production Environment Analysis
    if (rootResource.environment === 'PRODUCTION') {
      findings.push({
        id: `sec-prod-boundary-${rootResource.id}`,
        severity: 'HIGH',
        title: 'Production Network Boundary Disruption',
        description: `Target resource ${rootResource.name} (${rootResource.type}) operates in PRODUCTION and encapsulates mission-critical infrastructure.`,
        resourceId: rootResource.id,
        affectedResourceId: rootResource.id,
      });
    }

    // 2. Network Isolation / Subnet Dependency Analysis
    if (rootResource.type === 'Subnet') {
      const hostedServices = analysis.directDependencies.filter(
        (r) => r.type === 'EC2' || r.type === 'ECS' || r.type === 'Lambda'
      );
      if (hostedServices.length > 0) {
        findings.push({
          id: `sec-net-isolation-${rootResource.id}`,
          severity: 'CRITICAL',
          title: 'Hosted Workload Network Isolation',
          description: `Deleting ${rootResource.name} removes network interfaces (ENIs) for ${hostedServices.length} hosted compute service(s).`,
          resourceId: rootResource.id,
          affectedResourceId: rootResource.id,
        });
      }
    }

    // 3. Critical Database Dependencies Analysis
    const databases = affected.filter((r) => r.type === 'RDS');
    for (const db of databases) {
      const isCritical = db.criticality === 'CRITICAL' || db.criticality === 'HIGH';
      findings.push({
        id: `sec-db-disruption-${db.id}`,
        severity: isCritical ? 'CRITICAL' : 'HIGH',
        title: 'Transactional Database Connectivity Severed',
        description: `Database ${db.name} (${db.type}) will lose network and client connectivity, risking transactional data pipeline failures.`,
        resourceId: db.id,
        affectedResourceId: db.id,
      });
    }

    // 4. Public Exposure & Ingress Gateway Analysis
    const publicExposures = affected.filter((r) => r.isExternal === true && r.type === 'LoadBalancer');
    for (const lb of publicExposures) {
      findings.push({
        id: `sec-ingress-exposure-${lb.id}`,
        severity: 'HIGH',
        title: 'Public Ingress Gateway Disruption',
        description: `Internet-facing entrypoint ${lb.name} will fail health checks and produce 502/504 gateway failures to public users.`,
        resourceId: lb.id,
        affectedResourceId: lb.id,
      });
    }

    // 5. External Partner Integrations Analysis
    const externalPartners = affected.filter((r) => r.isExternal === true && r.type === 'External');
    for (const ext of externalPartners) {
      findings.push({
        id: `sec-ext-partner-${ext.id}`,
        severity: 'HIGH',
        title: 'External Partner Integration Severed',
        description: `External banking/partner integration ${ext.name} will experience ungraceful connection drops and transaction timeouts.`,
        resourceId: ext.id,
        affectedResourceId: ext.id,
      });
    }

    // 6. Security Group Dependencies Analysis
    const securityGroups = affected.filter((r) => r.type === 'SecurityGroup');
    for (const sg of securityGroups) {
      findings.push({
        id: `sec-sg-orphaned-${sg.id}`,
        severity: 'MEDIUM',
        title: 'Security Group Firewall Boundary Severed',
        description: `Firewall rules in ${sg.name} will be detached and orphaned from runtime workloads.`,
        resourceId: sg.id,
        affectedResourceId: sg.id,
      });
    }

    // 7. IAM Privilege Context Analysis
    const iamRoles = affected.filter((r) => r.type === 'IAM');
    for (const iam of iamRoles) {
      findings.push({
        id: `sec-iam-severed-${iam.id}`,
        severity: 'HIGH',
        title: 'IAM Execution Role Context Interrupted',
        description: `Execution privilege context ${iam.name} will be severed from application workloads.`,
        resourceId: iam.id,
        affectedResourceId: iam.id,
      });
    }

    // 8. Sensitive Storage Data Pipeline Analysis
    const storageBuckets = affected.filter((r) => r.type === 'S3');
    for (const s3 of storageBuckets) {
      findings.push({
        id: `sec-storage-pipeline-${s3.id}`,
        severity: 'HIGH',
        title: 'Sensitive Storage Ingestion Pipeline Halt',
        description: `Audit and compliance data storage in ${s3.name} will be interrupted as writers lose execution access.`,
        resourceId: s3.id,
        affectedResourceId: s3.id,
      });
    }

    // Determine aggregate security risk level
    const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
    const highCount = findings.filter((f) => f.severity === 'HIGH').length;
    const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
    const lowCount = findings.filter((f) => f.severity === 'LOW').length;

    let securityRisk: FindingSeverity = 'LOW';
    if (criticalCount > 0) {
      securityRisk = 'CRITICAL';
    } else if (highCount > 0) {
      securityRisk = 'HIGH';
    } else if (mediumCount > 0) {
      securityRisk = 'MEDIUM';
    }

    return {
      resourceId,
      securityRisk,
      findings,
      criticalFindingsCount: criticalCount,
      highFindingsCount: highCount,
      mediumFindingsCount: mediumCount,
      lowFindingsCount: lowCount,
    };
  }
}

export const securityAnalysisService = new SecurityAnalysisService();
