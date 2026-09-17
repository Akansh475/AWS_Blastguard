import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryRequestRepository } from '../src/repositories/request.repository';
import { ChangeRequest } from '../src/models/changeRequest.model';
import { AnalysisResult } from '../src/models/analysisResult.model';

describe('InMemoryRequestRepository', () => {
  let repository: InMemoryRequestRepository;

  beforeEach(() => {
    repository = new InMemoryRequestRepository(false); // Clean without seed
  });

  it('should create and retrieve a change request', async () => {
    const request: ChangeRequest = {
      requestId: 'req_test_1',
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await repository.createRequest(request);
    expect(created.requestId).toBe('req_test_1');

    const retrieved = await repository.getRequest('req_test_1');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.resourceId).toBe('subnet-07');
    expect(retrieved?.status).toBe('PENDING');
  });

  it('should filter requests by status', async () => {
    await repository.createRequest({
      requestId: 'req_1',
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      status: 'BLOCKED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await repository.createRequest({
      requestId: 'req_2',
      action: 'CREATE',
      resourceId: 'vpc-1',
      resourceType: 'VPC',
      region: 'ap-south-1',
      environment: 'DEV',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const pendingList = await repository.listRequests({ status: 'PENDING' });
    expect(pendingList).toHaveLength(1);
    expect(pendingList[0].requestId).toBe('req_2');

    const blockedList = await repository.listRequests({ status: 'BLOCKED' });
    expect(blockedList).toHaveLength(1);
    expect(blockedList[0].requestId).toBe('req_1');
  });

  it('should save and retrieve an analysis result', async () => {
    const analysis: AnalysisResult = {
      requestId: 'req_1',
      resourceId: 'subnet-07',
      action: 'DELETE',
      status: 'BLOCKED',
      riskScore: 87,
      severity: 'CRITICAL',
      decision: 'BLOCK',
      affectedResources: 11,
      criticalServices: 3,
      externalDependencies: 2,
      summary: 'Impacts 11 resources',
      policyViolations: [],
      securityFindings: [],
      dependencies: [],
      impactGraph: { nodes: [], links: [] },
      analyzedAt: new Date().toISOString(),
    };

    await repository.saveAnalysisResult(analysis);
    const retrieved = await repository.getAnalysisResult('req_1');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.riskScore).toBe(87);
    expect(retrieved?.decision).toBe('BLOCK');
  });

  it('should update request status and risk score', async () => {
    await repository.createRequest({
      requestId: 'req_update',
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = await repository.updateRequestStatus('req_update', 'BLOCKED', 87);
    expect(updated?.status).toBe('BLOCKED');
    expect(updated?.riskScore).toBe(87);

    const reloaded = await repository.getRequest('req_update');
    expect(reloaded?.status).toBe('BLOCKED');
    expect(reloaded?.riskScore).toBe(87);
  });
});
