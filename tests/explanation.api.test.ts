import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/api/server';
import { InMemoryRequestRepository } from '../src/repositories/request.repository';
import { InfrastructureIntelligenceProvider } from '../src/orchestration/infrastructure.provider';
import { AnalysisOrchestrator } from '../src/orchestration/analysis.orchestrator';
import { RequestService } from '../src/services/request.service';
import { ExplanationService } from '../src/ai/explanation.service';
import { MockBedrockClient } from '../src/ai/bedrock.client';

describe('AI Explanation API Endpoints', () => {
  let app: ReturnType<typeof createApp>;
  let repository: InMemoryRequestRepository;

  beforeEach(() => {
    repository = new InMemoryRequestRepository(true); // Pre-seeded with req_01 (subnet-07 analyzed)
    const intelligence = new InfrastructureIntelligenceProvider();
    const orchestrator = new AnalysisOrchestrator(intelligence);
    const mockBedrock = new MockBedrockClient();
    const explanationService = new ExplanationService(mockBedrock, repository);
    const requestService = new RequestService(repository, orchestrator, explanationService);

    app = createApp({ repository, intelligenceProvider: intelligence, orchestrator, requestService });
  });

  describe('POST /api/requests/:requestId/explain', () => {
    it('should generate structured AI explanation for an analyzed change request', async () => {
      // req_01 is already analyzed in seed data
      const res = await request(app).post('/api/requests/req_01/explain');

      expect(res.status).toBe(200);
      expect(res.body.requestId).toBe('req_01');
      expect(res.body.explanation).toBeDefined();
      expect(res.body.explanation.summary).toBeDefined();
      expect(res.body.explanation.whyBlocked).toContain('subnet-07');
      expect(res.body.explanation.impactExplanation).toContain('11');
      expect(res.body.explanation.keyReasons.length).toBeGreaterThan(0);
      expect(res.body.model).toBeDefined();
    });

    it('should return 409 Conflict with ANALYSIS_REQUIRED error when request has not been analyzed', async () => {
      // req_05 is PENDING in seed data (not analyzed)
      const res = await request(app).post('/api/requests/req_05/explain');

      expect(res.status).toBe(409);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('ANALYSIS_REQUIRED');
      expect(res.body.error.message).toContain('must be analyzed');
    });

    it('should return 404 with REQUEST_NOT_FOUND error when request does not exist', async () => {
      const res = await request(app).post('/api/requests/req_non_existent/explain');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('GET /api/requests/:requestId/explanation', () => {
    it('should retrieve previously generated explanation', async () => {
      // 1. Generate explanation
      await request(app).post('/api/requests/req_01/explain');

      // 2. Retrieve explanation
      const res = await request(app).get('/api/requests/req_01/explanation');

      expect(res.status).toBe(200);
      expect(res.body.requestId).toBe('req_01');
      expect(res.body.explanation).toBeDefined();
      expect(res.body.explanation.whyBlocked).toBeDefined();
    });

    it('should return 404 with EXPLANATION_NOT_FOUND when explanation has not been generated', async () => {
      // req_02 is SAFE and analyzed, but explanation has not been triggered
      const res = await request(app).get('/api/requests/req_02/explanation');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('EXPLANATION_NOT_FOUND');
    });
  });

  describe('Critical Regression Demo: DELETE subnet-07 with AI Explanation', () => {
    it('should maintain deterministic metrics through the entire create -> analyze -> explain flow', async () => {
      // 1. Create Change Request
      const createRes = await request(app).post('/api/requests').send({
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      });

      expect(createRes.status).toBe(201);
      const { requestId } = createRes.body;

      // 2. Trigger Person 1 Infrastructure Analysis
      const analyzeRes = await request(app).post(`/api/requests/${requestId}/analyze`);
      expect(analyzeRes.status).toBe(200);
      expect(analyzeRes.body.riskScore).toBe(87);
      expect(analyzeRes.body.severity).toBe('CRITICAL');
      expect(analyzeRes.body.decision).toBe('BLOCK');
      expect(analyzeRes.body.affectedResources).toBe(11);
      expect(analyzeRes.body.criticalServices).toBe(3);
      expect(analyzeRes.body.externalDependencies).toBe(2);

      // 3. Trigger Bedrock AI Explanation
      const explainRes = await request(app).post(`/api/requests/${requestId}/explain`);
      expect(explainRes.status).toBe(200);
      expect(explainRes.body.explanation.whyBlocked).toContain('subnet-07');
      expect(explainRes.body.explanation.impactExplanation).toContain('11');

      // 4. Verify request details retain EXACT deterministic metrics
      const detailRes = await request(app).get(`/api/requests/${requestId}`);
      expect(detailRes.status).toBe(200);
      expect(detailRes.body.riskScore).toBe(87);
      expect(detailRes.body.severity).toBe('CRITICAL');
      expect(detailRes.body.decision).toBe('BLOCK');
      expect(detailRes.body.affectedResources).toBe(11);
      expect(detailRes.body.criticalServices).toBe(3);
      expect(detailRes.body.externalDependencies).toBe(2);
      expect(detailRes.body.status).toBe('BLOCKED');
    });
  });
});
