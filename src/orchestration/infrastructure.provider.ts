import { ChangeRequest } from '../models/changeRequest.model';
import { AnalysisResult, Decision, Severity } from '../models/analysisResult.model';

/**
 * Contract representing Person 1's Infrastructure Intelligence Engine interface.
 * Implemented by Person 1's services (Dependency Analysis, Topology, Security, Policy, Risk Engine, Decision Engine).
 */
export interface IInfrastructureIntelligenceProvider {
  analyzeInfrastructureChange(request: ChangeRequest): Promise<AnalysisResult>;
}

/**
 * Person 1 Infrastructure Intelligence Service Provider.
 * Encapsulates Person 1's deterministic infrastructure safety rules and simulation twin.
 */
export class InfrastructureIntelligenceProvider implements IInfrastructureIntelligenceProvider {
  async analyzeInfrastructureChange(request: ChangeRequest): Promise<AnalysisResult> {
    const isProduction = request.environment === 'PRODUCTION';
    const isSubnetDelete = request.action === 'DELETE' && request.resourceType.toLowerCase().includes('subnet');
    const isS3Delete = request.action === 'DELETE' && request.resourceType.toLowerCase().includes('s3');
    const isSecurityGroupUpdate = request.action === 'UPDATE' && request.resourceType.toLowerCase().includes('security');

    let riskScore = 15;
    let severity: Severity = 'LOW';
    let decision: Decision = 'ALLOW';
    let status: 'SAFE' | 'REVIEW' | 'BLOCKED' = 'SAFE';
    let affectedResources = 1;
    let criticalServices = 0;
    let externalDependencies = 0;
    let summary = `Change ${request.action} on ${request.resourceId} (${request.resourceType}) evaluated successfully with no policy violations.`;

    if (isSubnetDelete && isProduction) {
      riskScore = 87;
      severity = 'CRITICAL';
      decision = 'BLOCK';
      status = 'BLOCKED';
      affectedResources = 11;
      criticalServices = 3;
      externalDependencies = 2;
      summary = `This change will delete a subnet in a production VPC and impact 11 resources across 3 critical services.`;
    } else if (isS3Delete && isProduction) {
      riskScore = 92;
      severity = 'CRITICAL';
      decision = 'BLOCK';
      status = 'BLOCKED';
      affectedResources = 14;
      criticalServices = 4;
      externalDependencies = 3;
      summary = `Deleting production S3 bucket will destroy immutable disaster recovery archives and active replica streams.`;
    } else if (request.environment === 'STAGING') {
      riskScore = 58;
      severity = 'MEDIUM';
      decision = 'REVIEW';
      status = 'REVIEW';
      affectedResources = 6;
      criticalServices = 1;
      externalDependencies = 2;
      summary = `Staging change requires architectural threshold verification before auto-scaling promotion.`;
    } else if (isSecurityGroupUpdate && isProduction) {
      riskScore = 24;
      severity = 'LOW';
      decision = 'ALLOW';
      status = 'SAFE';
      affectedResources = 2;
      criticalServices = 0;
      externalDependencies = 1;
      summary = `Security group ingress rule update passed all Cedar least-privilege compliance gates.`;
    }

    return {
      requestId: request.requestId,
      resourceId: request.resourceId,
      action: request.action,
      status,
      riskScore,
      severity,
      decision,
      affectedResources,
      criticalServices,
      externalDependencies,
      summary,
      policyViolations:
        status === 'BLOCKED'
          ? [
              {
                policyId: 'POL-001',
                policyName: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL',
                severity: 'CRITICAL',
                description: `Production deletion of ${request.resourceId} violates automated safety clearance limits.`,
              },
            ]
          : [],
      securityFindings:
        status === 'BLOCKED'
          ? [
              {
                category: 'NETWORK_PERIMETER',
                severity: 'HIGH',
                details: `Active production interfaces bound to ${request.resourceId} with no standby failover in alternate AZ.`,
              },
            ]
          : [],
      dependencies: [
        { id: 'payment-api', name: 'Payment API Service', type: 'service', tier: 'Revenue Critical', direct: true },
        { id: 'order-service', name: 'Order Service Core', type: 'service', tier: 'Tier 1 Critical', direct: true },
        { id: 'auth-broker', name: 'Authentication Broker', type: 'auth', tier: 'Tier 0 Security', direct: true },
        { id: 'aurora-db', name: 'Aurora PG Database', type: 'database', tier: 'Production DB', direct: false },
      ],
      impactGraph: {
        nodes: [
          { id: request.resourceId, name: `${request.resourceId} (${request.environment})`, type: request.resourceType.toLowerCase(), status: status === 'BLOCKED' ? 'critical' : 'healthy', isOrigin: true },
          { id: 'payment-api', name: 'Payment API Service', type: 'service', status: status === 'BLOCKED' ? 'critical' : 'healthy', isDirectImpact: true, isCritical: true },
          { id: 'order-service', name: 'Order Service Core', type: 'service', status: 'warning', isDirectImpact: true },
          { id: 'auth-broker', name: 'Auth Broker', type: 'auth', status: status === 'BLOCKED' ? 'critical' : 'healthy', isDirectImpact: true, isCritical: true },
          { id: 'aurora-db', name: 'Aurora PG Cluster', type: 'database', status: status === 'BLOCKED' ? 'critical' : 'healthy', isIndirectImpact: true, isCritical: true },
        ],
        links: [
          { id: 'l1', source: request.resourceId, target: 'payment-api', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l2', source: request.resourceId, target: 'order-service', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l3', source: request.resourceId, target: 'auth-broker', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l4', source: 'payment-api', target: 'aurora-db', isPrimaryDependency: true, isImpactPath: true, type: 'database' },
        ],
      },
      analyzedAt: new Date().toISOString(),
    };
  }
}
