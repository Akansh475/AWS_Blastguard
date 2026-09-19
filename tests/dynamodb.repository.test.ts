import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBRequestRepository } from '../src/repositories/dynamodb.request.repository';
import { ChangeRequest } from '../src/models/changeRequest.model';
import { AnalysisResult } from '../src/models/analysisResult.model';

describe('DynamoDBRequestRepository with AWS SDK v3 Mock', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  let repository: DynamoDBRequestRepository;
  const testTableName = 'TestBlastGuardRequests';

  beforeEach(() => {
    ddbMock.reset();
    repository = new DynamoDBRequestRepository(ddbMock as unknown as DynamoDBDocumentClient, testTableName);
  });

  afterEach(() => {
    ddbMock.restore();
  });

  describe('createRequest', () => {
    it('should issue PutCommand with correct item and return the created request', async () => {
      ddbMock.on(PutCommand).resolves({});

      const request: ChangeRequest = {
        requestId: 'req_ddb_01',
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'PENDING',
        createdAt: '2026-09-17T10:00:00.000Z',
        updatedAt: '2026-09-17T10:00:00.000Z',
      };

      const result = await repository.createRequest(request);

      expect(result.requestId).toBe('req_ddb_01');
      expect(result.resourceId).toBe('subnet-07');
      expect(ddbMock.calls()).toHaveLength(1);
      const putCall = ddbMock.call(0);
      expect(putCall.args[0].input).toMatchObject({
        TableName: testTableName,
        Item: {
          requestId: 'req_ddb_01',
          action: 'DELETE',
          resourceId: 'subnet-07',
          status: 'PENDING',
        },
      });
    });
  });

  describe('getRequest', () => {
    it('should return mapped ChangeRequest when found in DynamoDB', async () => {
      ddbMock.on(GetCommand).resolves({
        Item: {
          requestId: 'req_ddb_01',
          action: 'DELETE',
          resourceId: 'subnet-07',
          resourceType: 'Subnet',
          region: 'ap-south-1',
          environment: 'PRODUCTION',
          status: 'BLOCKED',
          riskScore: 87,
          severity: 'CRITICAL',
          decision: 'BLOCK',
          affectedResources: 11,
          criticalServices: 3,
          externalDependencies: 2,
          createdAt: '2026-09-17T10:00:00.000Z',
          updatedAt: '2026-09-17T10:00:05.000Z',
        },
      });

      const result = await repository.getRequest('req_ddb_01');

      expect(result).not.toBeNull();
      expect(result?.requestId).toBe('req_ddb_01');
      expect(result?.riskScore).toBe(87);
      expect(result?.severity).toBe('CRITICAL');
      expect(result?.decision).toBe('BLOCK');
      expect(result?.affectedResources).toBe(11);
      expect(result?.criticalServices).toBe(3);
    });

    it('should return null when item does not exist in DynamoDB', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });

      const result = await repository.getRequest('req_missing');

      expect(result).toBeNull();
    });
  });

  describe('listRequests & filtering', () => {
    it('should list all requests sorted by createdAt descending', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [
          {
            requestId: 'req_old',
            action: 'CREATE',
            resourceId: 'vpc-old',
            resourceType: 'VPC',
            region: 'ap-south-1',
            environment: 'DEV',
            status: 'PENDING',
            createdAt: '2026-09-17T09:00:00.000Z',
            updatedAt: '2026-09-17T09:00:00.000Z',
          },
          {
            requestId: 'req_new',
            action: 'DELETE',
            resourceId: 'subnet-07',
            resourceType: 'Subnet',
            region: 'ap-south-1',
            environment: 'PRODUCTION',
            status: 'BLOCKED',
            riskScore: 87,
            createdAt: '2026-09-17T10:00:00.000Z',
            updatedAt: '2026-09-17T10:00:00.000Z',
          },
        ],
      });

      const list = await repository.listRequests();

      expect(list).toHaveLength(2);
      expect(list[0].requestId).toBe('req_new');
      expect(list[1].requestId).toBe('req_old');
    });

    it('should apply FilterExpression when status filter is specified', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [
          {
            requestId: 'req_blocked',
            action: 'DELETE',
            resourceId: 'subnet-07',
            resourceType: 'Subnet',
            region: 'ap-south-1',
            environment: 'PRODUCTION',
            status: 'BLOCKED',
            createdAt: '2026-09-17T10:00:00.000Z',
            updatedAt: '2026-09-17T10:00:00.000Z',
          },
        ],
      });

      const list = await repository.listRequests({ status: 'BLOCKED' });

      expect(list).toHaveLength(1);
      expect(list[0].status).toBe('BLOCKED');
      const scanCall = ddbMock.call(0);
      expect(scanCall.args[0].input).toMatchObject({
        TableName: testTableName,
        FilterExpression: '#st = :status',
        ExpressionAttributeValues: { ':status': 'BLOCKED' },
      });
    });
  });

  describe('updateRequestStatus', () => {
    it('should execute UpdateCommand and return updated request', async () => {
      ddbMock.on(UpdateCommand).resolves({
        Attributes: {
          requestId: 'req_01',
          action: 'DELETE',
          resourceId: 'subnet-07',
          resourceType: 'Subnet',
          region: 'ap-south-1',
          environment: 'PRODUCTION',
          status: 'BLOCKED',
          riskScore: 87,
          createdAt: '2026-09-17T10:00:00.000Z',
          updatedAt: '2026-09-17T10:00:05.000Z',
        },
      });

      const updated = await repository.updateRequestStatus('req_01', 'BLOCKED', 87);

      expect(updated).not.toBeNull();
      expect(updated?.status).toBe('BLOCKED');
      expect(updated?.riskScore).toBe(87);
      expect(ddbMock.calls()).toHaveLength(1);
      const updateCall = ddbMock.call(0);
      expect(updateCall.args[0].input).toMatchObject({
        TableName: testTableName,
        Key: { requestId: 'req_01' },
      });
    });
  });

  describe('saveAnalysisResult & getAnalysisResult', () => {
    it('should save complete AnalysisResult with Person 1 values', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      const analysis: AnalysisResult = {
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
        policyViolations: [],
        securityFindings: [],
        dependencies: [],
        impactGraph: { nodes: [], links: [] },
        analyzedAt: '2026-09-17T10:00:05.000Z',
      };

      const saved = await repository.saveAnalysisResult(analysis);

      expect(saved.riskScore).toBe(87);
      expect(saved.decision).toBe('BLOCK');
      expect(ddbMock.calls()).toHaveLength(1);
      const updateCall = ddbMock.call(0);
      expect(updateCall.args[0].input).toMatchObject({
        TableName: testTableName,
        Key: { requestId: 'req_01' },
      });
    });

    it('should retrieve analysis result projection from DynamoDB', async () => {
      const mockAnalysis: AnalysisResult = {
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
        summary: 'Critical subnet deletion',
        policyViolations: [],
        securityFindings: [],
        dependencies: [],
        impactGraph: { nodes: [], links: [] },
        analyzedAt: '2026-09-17T10:00:05.000Z',
      };

      ddbMock.on(GetCommand).resolves({
        Item: {
          requestId: 'req_01',
          analysisResult: mockAnalysis,
        },
      });

      const retrieved = await repository.getAnalysisResult('req_01');

      expect(retrieved).not.toBeNull();
      expect(retrieved?.riskScore).toBe(87);
      expect(retrieved?.severity).toBe('CRITICAL');
      expect(retrieved?.decision).toBe('BLOCK');
      expect(retrieved?.affectedResources).toBe(11);
      expect(retrieved?.criticalServices).toBe(3);
      expect(retrieved?.externalDependencies).toBe(2);
    });
  });
});
