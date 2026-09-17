import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { impactAnalysisService } from '../src/services/ImpactAnalysisService';
import { securityAnalysisService } from '../src/services/SecurityAnalysisService';
import { policyAnalysisService } from '../src/services/PolicyAnalysisService';
import { blastRadiusService } from '../src/services/BlastRadiusService';

describe('Stage 3: Security Analysis + Policy Engine + Blast Radius', () => {
  describe('ImpactAnalysisService', () => {
    it('determines directImpact, indirectImpact, totalAffected, criticalServices, externalDependencies, and productionImpact for subnet-07', async () => {
      const result = await impactAnalysisService.analyzeImpact('subnet-07');

      expect(result.totalAffected).toBe(11);
      expect(result.criticalServices).toBe(3);
      expect(result.externalDependencies).toBe(2);
      expect(result.productionImpact).toBe(true);
      expect(result.productionResources).toBe(11);
      expect(result.directImpact).toBe(2);
      expect(result.indirectImpact).toBe(8);

      // Verify array contents
      expect(result.affectedResources.length).toBe(11);
      expect(result.criticalServiceResources.length).toBe(3);
      expect(result.externalDependencyResources.length).toBe(2);

      const criticalIds = result.criticalServiceResources.map((r) => r.id);
      expect(criticalIds).toContain('payment-api');
      expect(criticalIds).toContain('payment-worker');
      expect(criticalIds).toContain('payment-notifier');

      const externalIds = result.externalDependencyResources.map((r) => r.id);
      expect(externalIds).toContain('production-load-balancer');
      expect(externalIds).toContain('external-payment-gateway');
    });
  });

  describe('SecurityAnalysisService', () => {
    it('analyzes production, database, network, security group, IAM, public exposure, and storage conditions for subnet-07', async () => {
      const result = await securityAnalysisService.analyzeSecurity('subnet-07');

      expect(result.securityRisk).toBe('CRITICAL');
      expect(result.findings.length).toBeGreaterThanOrEqual(6);

      // Verify finding structure: id, severity, title, description, resourceId
      result.findings.forEach((finding) => {
        expect(finding.id).toBeDefined();
        expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(finding.severity);
        expect(finding.title).toBeDefined();
        expect(finding.description).toBeDefined();
        expect(finding.resourceId).toBeDefined();
      });

      // Verify specific infrastructure-supported findings
      const findingIds = result.findings.map((f) => f.id);

      // 1. Production boundary
      expect(findingIds.some((id) => id.startsWith('sec-prod-boundary-'))).toBe(true);
      // 2. Hosted network isolation
      expect(findingIds.some((id) => id.startsWith('sec-net-isolation-'))).toBe(true);
      // 3. Database connectivity loss
      expect(findingIds.some((id) => id.startsWith('sec-db-disruption-payment-db'))).toBe(true);
      // 4. Ingress gateway disruption
      expect(findingIds.some((id) => id.startsWith('sec-ingress-exposure-production-load-balancer'))).toBe(true);
      // 5. External partner integration
      expect(findingIds.some((id) => id.startsWith('sec-ext-partner-external-payment-gateway'))).toBe(true);
      // 6. Security group rules severed
      expect(findingIds.some((id) => id.startsWith('sec-sg-orphaned-payment-security-group'))).toBe(true);
      // 7. IAM execution context severed
      expect(findingIds.some((id) => id.startsWith('sec-iam-severed-iam-payment-role'))).toBe(true);
      // 8. Storage pipeline halt
      expect(findingIds.some((id) => id.startsWith('sec-storage-pipeline-payment-data-bucket'))).toBe(true);
    });
  });

  describe('PolicyAnalysisService', () => {
    it('evaluates POLICY-001, POLICY-002, POLICY-003, and POLICY-004 on DELETE subnet-07', async () => {
      const result = await policyAnalysisService.evaluatePolicies('subnet-07', 'DELETE');

      expect(result.passed).toBe(false);
      expect(result.violationsCount).toBe(4);
      expect(result.violations.length).toBe(4);

      // Verify violation structure: policyId, severity, message, resourceId
      result.violations.forEach((violation) => {
        expect(violation.policyId).toBeDefined();
        expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(violation.severity);
        expect(violation.message).toBeDefined();
        expect(violation.resourceId).toBe('subnet-07');
      });

      const policyIds = result.violations.map((v) => v.policyId);

      // POLICY-001: Production infrastructure changes require approval.
      expect(policyIds).toContain('POLICY-001');
      const p1 = result.violations.find((v) => v.policyId === 'POLICY-001')!;
      expect(p1.severity).toBe('HIGH');
      expect(p1.message).toContain('PRODUCTION');

      // POLICY-002: Critical resources cannot be deleted automatically.
      expect(policyIds).toContain('POLICY-002');
      const p2 = result.violations.find((v) => v.policyId === 'POLICY-002')!;
      expect(p2.severity).toBe('CRITICAL');

      // POLICY-003: Resources with critical downstream dependencies require review.
      expect(policyIds).toContain('POLICY-003');
      const p3 = result.violations.find((v) => v.policyId === 'POLICY-003')!;
      expect(p3.severity).toBe('CRITICAL');
      expect(p3.message).toContain('payment-api');

      // POLICY-004: Changes affecting external dependencies require additional approval.
      expect(policyIds).toContain('POLICY-004');
      const p4 = result.violations.find((v) => v.policyId === 'POLICY-004')!;
      expect(p4.severity).toBe('HIGH');
      expect(p4.message).toContain('production-load-balancer');
    });

    it('passes POLICY-002 when action is UPDATE instead of DELETE on critical resource', async () => {
      const result = await policyAnalysisService.evaluatePolicies('subnet-07', 'UPDATE');

      const policyIds = result.violations.map((v) => v.policyId);
      // POLICY-002 only blocks DELETE on critical resources
      expect(policyIds).not.toContain('POLICY-002');
    });
  });

  describe('BlastRadiusService', () => {
    it('synthesizes Dependency, Impact, Security, and Policy into unified assessment without AI', async () => {
      const assessment = await blastRadiusService.assessBlastRadius('subnet-07', 'DELETE');

      expect(assessment.resourceId).toBe('subnet-07');
      expect(assessment.action).toBe('DELETE');
      expect(assessment.totalAffected).toBe(11);
      expect(assessment.criticalServices).toBe(3);
      expect(assessment.externalDependencies).toBe(2);
      expect(assessment.directImpact).toBe(2);
      expect(assessment.indirectImpact).toBe(8);
      expect(assessment.productionImpact).toBe(true);
      expect(assessment.productionResources).toBe(11);
      expect(assessment.securityRisk).toBe('CRITICAL');
      expect(assessment.policiesPassed).toBe(false);
      expect(assessment.policyViolations.length).toBe(4);
      expect(assessment.securityFindings.length).toBeGreaterThanOrEqual(6);

      // Verify ID lists
      expect(assessment.affectedResourceIds.length).toBe(11);
      expect(assessment.criticalServiceIds).toEqual(['payment-api', 'payment-worker', 'payment-notifier']);
      expect(assessment.externalDependencyIds).toEqual(['production-load-balancer', 'external-payment-gateway']);
    });
  });

  describe('End-to-End API Integration', () => {
    it('POST /api/requests/:requestId/analyze returns real security findings and policy violations from Stage 3', async () => {
      // Create request
      const createRes = await request(app)
        .post('/api/requests')
        .send({
          action: 'DELETE',
          resourceId: 'subnet-07',
          resourceType: 'Subnet',
          region: 'ap-south-1',
          environment: 'PRODUCTION',
          details: { reason: 'Decommissioning subnet-07' },
        });

      expect(createRes.status).toBe(201);
      const requestId = createRes.body.data.id;

      // Analyze request
      const analyzeRes = await request(app).post(`/api/requests/${requestId}/analyze`).send();

      expect(analyzeRes.status).toBe(200);
      const analysis = analyzeRes.body.data;

      expect(analysis.requestId).toBe(requestId);
      expect(analysis.blastRadius).toBe(11);
      expect(analysis.status).toBe('BLOCKED');
      expect(analysis.decision).toBe('BLOCK');

      // Verify security findings populated
      expect(analysis.securityFindings.length).toBeGreaterThanOrEqual(6);
      expect(analysis.securityFindings[0]).toHaveProperty('id');
      expect(analysis.securityFindings[0]).toHaveProperty('severity');
      expect(analysis.securityFindings[0]).toHaveProperty('resourceId');

      // Verify policy violations populated
      expect(analysis.policyViolations.length).toBe(4);
      const pIds = analysis.policyViolations.map((v: { policyId: string }) => v.policyId);
      expect(pIds).toContain('POLICY-001');
      expect(pIds).toContain('POLICY-002');
      expect(pIds).toContain('POLICY-003');
      expect(pIds).toContain('POLICY-004');

      // Verify recommendations generated
      expect(analysis.recommendations.length).toBeGreaterThan(0);
      expect(analysis.recommendations.some((r: string) => r.includes('POLICY-001'))).toBe(true);
    });
  });
});
