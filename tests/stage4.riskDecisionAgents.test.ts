import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { riskEngine } from '../src/engine/RiskEngine';
import { decisionEngine } from '../src/engine/DecisionEngine';
import { supervisorAgent } from '../src/agents/SupervisorAgent';
import { dependencyAgent } from '../src/agents/DependencyAgent';
import { topologyAgent } from '../src/agents/TopologyAgent';
import { securityAgent } from '../src/agents/SecurityAgent';
import { impactAgent } from '../src/agents/ImpactAgent';
import { policyAgent } from '../src/agents/PolicyAgent';
import { MockResourceProvider } from '../src/providers/MockResourceProvider';
import { Resource } from '../models/Resource';

describe('Stage 4: Risk Engine + Decision Engine + Agent Architecture', () => {
  const provider = new MockResourceProvider();

  describe('RiskEngine Unit Tests', () => {
    it('CRITICAL DEMO: computes exact riskScore=87 and expected breakdown for DELETE subnet-07', async () => {
      const targetResource = (await provider.getResource('subnet-07'))!;
      const depResult = await dependencyAgent.execute('subnet-07');
      const impactResult = await impactAgent.execute('subnet-07');
      const securityResult = await securityAgent.execute('subnet-07');
      const policyResult = await policyAgent.execute('subnet-07', 'DELETE');

      const result = riskEngine.calculateRisk({
        resource: targetResource,
        action: 'DELETE',
        affectedCount: impactResult.totalAffected,
        criticalServicesCount: impactResult.criticalServices,
        externalDependenciesCount: impactResult.externalDependencies,
        securityRisk: securityResult.securityRisk,
        securityFindings: securityResult.findings,
        policyViolations: policyResult.violations,
      });

      // Assert exact required score 87
      expect(result.riskScore).toBe(87);

      // Assert exact required breakdown: 25, 25, 15, 15, 7 = 87
      expect(result.riskBreakdown).toEqual({
        dependencyRisk: 25,
        criticalityRisk: 25,
        securityRisk: 15,
        policyRisk: 15,
        environmentRisk: 7,
        total: 87,
      });

      expect(result.factors.length).toBeGreaterThanOrEqual(5);
    });

    it('Scenario SAFE: produces score <= 30 and SAFE threshold for low-risk dev resource', () => {
      const devResource: Resource = {
        id: 's3-dev-scratch',
        name: 's3-dev-scratch',
        type: 'S3',
        region: 'ap-south-1',
        environment: 'DEV',
        criticality: 'LOW',
      };

      const result = riskEngine.calculateRisk({
        resource: devResource,
        action: 'UPDATE',
        affectedCount: 1,
        criticalServicesCount: 0,
        externalDependenciesCount: 0,
        securityRisk: 'LOW',
        securityFindings: [],
        policyViolations: [],
      });

      expect(result.riskScore).toBeLessThanOrEqual(30);
      expect(riskEngine.getThresholdDecision(result.riskScore)).toBe('SAFE');
    });

    it('Scenario REVIEW: produces score between 31 and 65 for moderate-risk change', () => {
      const stagingResource: Resource = {
        id: 'ec2-staging-api',
        name: 'ec2-staging-api',
        type: 'EC2',
        region: 'ap-south-1',
        environment: 'STAGING',
        criticality: 'HIGH',
      };

      const result = riskEngine.calculateRisk({
        resource: stagingResource,
        action: 'UPDATE',
        affectedCount: 6,
        criticalServicesCount: 0,
        externalDependenciesCount: 1,
        securityRisk: 'MEDIUM',
        securityFindings: [],
        policyViolations: [
          {
            policyId: 'POLICY-004',
            severity: 'HIGH',
            message: 'External dependency affected',
            resourceId: stagingResource.id,
          },
        ],
      });

      expect(result.riskScore).toBeGreaterThanOrEqual(31);
      expect(result.riskScore).toBeLessThanOrEqual(65);
      expect(riskEngine.getThresholdDecision(result.riskScore)).toBe('REVIEW');
    });

    it('Scenario BLOCK: produces score >= 66 for critical production change', () => {
      const prodResource: Resource = {
        id: 'rds-prod-db',
        name: 'rds-prod-db',
        type: 'RDS',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      };

      const result = riskEngine.calculateRisk({
        resource: prodResource,
        action: 'DELETE',
        affectedCount: 12,
        criticalServicesCount: 2,
        externalDependenciesCount: 1,
        securityRisk: 'CRITICAL',
        securityFindings: [],
        policyViolations: [
          {
            policyId: 'POLICY-002',
            severity: 'CRITICAL',
            message: 'Critical resource deletion',
            resourceId: prodResource.id,
          },
        ],
      });

      expect(result.riskScore).toBeGreaterThanOrEqual(66);
      expect(riskEngine.getThresholdDecision(result.riskScore)).toBe('BLOCK');
    });
  });

  describe('DecisionEngine Unit Tests', () => {
    it('evaluates mandatory BLOCK if any critical policy violation exists', () => {
      const output = decisionEngine.evaluateDecision({
        riskScore: 40, // Score would otherwise be REVIEW
        policyViolations: [
          {
            policyId: 'POLICY-002',
            severity: 'CRITICAL',
            message: 'Critical deletion guardrail violated',
            resourceId: 'res-1',
          },
        ],
      });

      expect(output.decision).toBe('BLOCK');
      expect(output.severity).toBe('CRITICAL');
      expect(output.reasons.some((r) => r.includes('POLICY-002'))).toBe(true);
    });

    it('evaluates BLOCK when riskScore >= 66 without critical policy', () => {
      const output = decisionEngine.evaluateDecision({
        riskScore: 70,
        policyViolations: [],
      });

      expect(output.decision).toBe('BLOCK');
      expect(output.reasons.some((r) => r.includes('BLOCK threshold'))).toBe(true);
    });

    it('evaluates REVIEW when riskScore is between 31 and 65', () => {
      const output = decisionEngine.evaluateDecision({
        riskScore: 45,
        policyViolations: [],
      });

      expect(output.decision).toBe('REVIEW');
      expect(output.severity).toBe('MEDIUM');
    });

    it('evaluates SAFE when riskScore is <= 30', () => {
      const output = decisionEngine.evaluateDecision({
        riskScore: 15,
        policyViolations: [],
      });

      expect(output.decision).toBe('SAFE');
      expect(output.severity).toBe('LOW');
    });
  });

  describe('Agent Architecture Unit Tests', () => {
    it('each agent successfully delegates to deterministic service without fabrication', async () => {
      const depResult = await dependencyAgent.execute('subnet-07');
      expect(depResult.affectedCount).toBe(11);

      const topResult = await topologyAgent.execute('subnet-07');
      expect(topResult.nodes.length).toBe(11);

      const secResult = await securityAgent.execute('subnet-07');
      expect(secResult.securityRisk).toBe('CRITICAL');

      const impResult = await impactAgent.execute('subnet-07');
      expect(impResult.totalAffected).toBe(11);

      const polResult = await policyAgent.execute('subnet-07', 'DELETE');
      expect(polResult.violations.length).toBe(4);
    });

    it('SupervisorAgent coordinates full pipeline and produces complete AnalysisResult contract', async () => {
      const changeRequest = {
        id: 'cr-test-01',
        action: 'DELETE' as const,
        resourceId: 'subnet-07',
        resourceType: 'Subnet' as const,
        region: 'ap-south-1',
        environment: 'PRODUCTION' as const,
        status: 'PENDING' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await supervisorAgent.orchestrateAnalysis(changeRequest);

      // Verify all required Stage 4 fields
      expect(result.requestId).toBe('cr-test-01');
      expect(result.resourceId).toBe('subnet-07');
      expect(result.riskScore).toBe(87);
      expect(result.severity).toBe('CRITICAL');
      expect(result.decision).toBe('BLOCK');
      expect(result.affectedResources).toBe(11);
      expect(result.criticalServices).toBe(3);
      expect(result.externalDependencies).toBe(2);

      // Verify risk breakdown
      expect(result.riskBreakdown).toEqual({
        dependencyRisk: 25,
        criticalityRisk: 25,
        securityRisk: 15,
        policyRisk: 15,
        environmentRisk: 7,
        total: 87,
      });

      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.securityFindings.length).toBeGreaterThanOrEqual(6);
      expect(result.policyViolations.length).toBe(4);
      expect(Array.isArray(result.dependencies)).toBe(true);
      expect(result.topology.nodes.length).toBe(11);
      expect(result.topology.edges.length).toBeGreaterThan(0);
    });
  });

  describe('End-to-End API Integration', () => {
    it('POST /api/requests/:requestId/analyze for DELETE subnet-07 returns 87, CRITICAL, BLOCK with full contract', async () => {
      // 1. Create proposed change request for DELETE subnet-07
      const createRes = await request(app)
        .post('/api/requests')
        .send({
          action: 'DELETE',
          resourceId: 'subnet-07',
          resourceType: 'Subnet',
          region: 'ap-south-1',
          environment: 'PRODUCTION',
          details: { reason: 'Stage 4 verification for subnet-07' },
        });

      expect(createRes.status).toBe(201);
      const requestId = createRes.body.data.id;

      // 2. Trigger analysis
      const analyzeRes = await request(app).post(`/api/requests/${requestId}/analyze`).send();

      expect(analyzeRes.status).toBe(200);
      const analysis = analyzeRes.body.data;

      // CRITICAL DEMO REQUIREMENTS
      expect(analysis.requestId).toBe(requestId);
      expect(analysis.resourceId).toBe('subnet-07');
      expect(analysis.riskScore).toBe(87);
      expect(analysis.severity).toBe('CRITICAL');
      expect(analysis.decision).toBe('BLOCK');
      expect(analysis.affectedResources).toBe(11);
      expect(analysis.criticalServices).toBe(3);
      expect(analysis.externalDependencies).toBe(2);

      // Risk breakdown
      expect(analysis.riskBreakdown).toEqual({
        dependencyRisk: 25,
        criticalityRisk: 25,
        securityRisk: 15,
        policyRisk: 15,
        environmentRisk: 7,
        total: 87,
      });

      // Data structures for Person 2
      expect(Array.isArray(analysis.reasons)).toBe(true);
      expect(analysis.securityFindings.length).toBeGreaterThanOrEqual(6);
      expect(analysis.policyViolations.length).toBe(4);
      expect(Array.isArray(analysis.dependencies)).toBe(true);
      expect(analysis.topology.nodes.length).toBe(11);
      expect(analysis.topology.edges.length).toBeGreaterThan(0);

      // Verify request status was updated to BLOCKED
      const getReqRes = await request(app).get(`/api/requests/${requestId}`);
      expect(getReqRes.status).toBe(200);
      expect(getReqRes.body.data.status).toBe('BLOCKED');
    });
  });
});
