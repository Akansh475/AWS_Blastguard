import { ChangeRequest, RequestFilterOptions, RequestStatus } from '../models/changeRequest.model';
import { AnalysisResult } from '../models/analysisResult.model';

export interface IRequestRepository {
  createRequest(request: ChangeRequest): Promise<ChangeRequest>;
  getRequest(requestId: string): Promise<ChangeRequest | null>;
  listRequests(filter?: RequestFilterOptions): Promise<ChangeRequest[]>;
  updateRequestStatus(requestId: string, status: RequestStatus, riskScore?: number): Promise<ChangeRequest | null>;
  saveAnalysisResult(result: AnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(requestId: string): Promise<AnalysisResult | null>;
  clearAll?(): Promise<void>; // Useful for automated testing
}

export class InMemoryRequestRepository implements IRequestRepository {
  private requests: Map<string, ChangeRequest> = new Map();
  private analysisResults: Map<string, AnalysisResult> = new Map();

  constructor(seed = true) {
    if (seed) {
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    const initialRequests: ChangeRequest[] = [
      {
        requestId: 'req_01',
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'BLOCKED',
        riskScore: 87,
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_02',
        action: 'UPDATE',
        resourceId: 'sg-prod-ingress',
        resourceType: 'Security Group',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'SAFE',
        riskScore: 24,
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_03',
        action: 'UPDATE',
        resourceId: 'ecs-api-cluster',
        resourceType: 'ECS Service',
        region: 'ap-south-1',
        environment: 'STAGING',
        status: 'REVIEW',
        riskScore: 58,
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_04',
        action: 'UPDATE',
        resourceId: 'aurora-pg-cluster',
        resourceType: 'RDS Cluster',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'SAFE',
        riskScore: 15,
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_05',
        action: 'CREATE',
        resourceId: 'fn-webhook-ingest',
        resourceType: 'Lambda Function',
        region: 'ap-south-1',
        environment: 'DEV',
        status: 'PENDING',
        riskScore: 10,
        createdAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_06',
        action: 'DELETE',
        resourceId: 'prod-backup-archive-2026',
        resourceType: 'S3 Bucket',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'BLOCKED',
        riskScore: 92,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_07',
        action: 'UPDATE',
        resourceId: 'iam-role-payment-worker',
        resourceType: 'IAM Policy',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'SAFE',
        riskScore: 19,
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      },
      {
        requestId: 'req_08',
        action: 'CREATE',
        resourceId: 'vpc-analytics-sandbox',
        resourceType: 'VPC',
        region: 'ap-south-1',
        environment: 'DEV',
        status: 'PENDING',
        riskScore: 5,
        createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      },
    ];

    for (const req of initialRequests) {
      this.requests.set(req.requestId, req);
    }

    // Seed analysis for req_01 (subnet-07)
    const subnetAnalysis: AnalysisResult = {
      requestId: 'req_01',
      resourceId: 'subnet-07',
      action: 'DELETE',
      status: 'BLOCKED',
      riskScore: 87,
      severity: 'CRITICAL',
      decision: 'BLOCK',
      affectedResources: 11,
      criticalServices: 3,
      externalDependencies: 2,
      summary: 'This change will delete a subnet in a production VPC and impact 11 resources across 3 critical services.',
      policyViolations: [
        {
          policyId: 'POL-001',
          policyName: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL',
          severity: 'CRITICAL',
          description: 'Deleting subnet-07 violates perimeter governance rules in ap-south-1.',
        },
      ],
      securityFindings: [
        {
          category: 'PERIMETER_ISOLATION',
          severity: 'HIGH',
          details: 'Active production Elastic Network Interfaces bound to subnet-07 with no failover route.',
        },
      ],
      dependencies: [
        { id: 'payment-api', name: 'Payment API Service', type: 'service', tier: 'Revenue Critical', direct: true },
        { id: 'order-service', name: 'Order Service Core', type: 'service', tier: 'Tier 1 Critical', direct: true },
        { id: 'auth-broker', name: 'Auth Broker', type: 'auth', tier: 'Tier 0 Security', direct: true },
        { id: 'aurora-db', name: 'Aurora PG Multi-AZ Cluster', type: 'database', tier: 'Production DB', direct: false },
      ],
      impactGraph: {
        nodes: [
          { id: 'subnet-07', name: 'subnet-07 (Prod-Network)', type: 'subnet', status: 'critical', isOrigin: true },
          { id: 'payment-api', name: 'Payment API Service', type: 'service', status: 'critical', isDirectImpact: true, isCritical: true },
          { id: 'order-service', name: 'Order Service Core', type: 'service', status: 'warning', isDirectImpact: true },
          { id: 'auth-broker', name: 'Authentication Broker', type: 'auth', status: 'critical', isDirectImpact: true, isCritical: true },
          { id: 'aurora-db', name: 'Production Database', type: 'database', status: 'critical', isIndirectImpact: true, isCritical: true },
        ],
        links: [
          { id: 'l1', source: 'subnet-07', target: 'payment-api', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l2', source: 'subnet-07', target: 'order-service', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l3', source: 'subnet-07', target: 'auth-broker', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
          { id: 'l4', source: 'payment-api', target: 'aurora-db', isPrimaryDependency: true, isImpactPath: true, type: 'database' },
        ],
      },
      analyzedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    };

    this.analysisResults.set('req_01', subnetAnalysis);
  }

  async createRequest(request: ChangeRequest): Promise<ChangeRequest> {
    this.requests.set(request.requestId, { ...request });
    return { ...request };
  }

  async getRequest(requestId: string): Promise<ChangeRequest | null> {
    const found = this.requests.get(requestId);
    return found ? { ...found } : null;
  }

  async listRequests(filter?: RequestFilterOptions): Promise<ChangeRequest[]> {
    let list = Array.from(this.requests.values());

    if (filter?.status) {
      list = list.filter((r) => r.status === filter.status);
    }

    // Sort descending by creation date
    return list
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((r) => ({ ...r }));
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    riskScore?: number
  ): Promise<ChangeRequest | null> {
    const existing = this.requests.get(requestId);
    if (!existing) return null;

    const updated: ChangeRequest = {
      ...existing,
      status,
      riskScore: riskScore !== undefined ? riskScore : existing.riskScore,
      updatedAt: new Date().toISOString(),
    };

    this.requests.set(requestId, updated);
    return { ...updated };
  }

  async saveAnalysisResult(result: AnalysisResult): Promise<AnalysisResult> {
    this.analysisResults.set(result.requestId, { ...result });
    return { ...result };
  }

  async getAnalysisResult(requestId: string): Promise<AnalysisResult | null> {
    const found = this.analysisResults.get(requestId);
    return found ? { ...found } : null;
  }

  async clearAll(): Promise<void> {
    this.requests.clear();
    this.analysisResults.clear();
  }
}
