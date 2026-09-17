import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/api/server';
import { InMemoryRequestRepository } from '../src/repositories/request.repository';
import { InfrastructureIntelligenceProvider } from '../src/orchestration/infrastructure.provider';
import { AnalysisOrchestrator } from '../src/orchestration/analysis.orchestrator';
import { RequestService } from '../src/services/request.service';

describe('BlastGuard REST API Endpoints', () => {
  let app: ReturnType<typeof createApp>;
  let repository: InMemoryRequestRepository;

  beforeEach(() => {
    repository = new InMemoryRequestRepository(true); // with initial seed
    const intelligence = new InfrastructureIntelligenceProvider();
    const orchestrator = new AnalysisOrchestrator(intelligence);
    const requestService = new RequestService(repository, orchestrator);

    app = createApp({ repository, intelligenceProvider: intelligence, orchestrator, requestService });
  });

  describe('GET /health', () => {
    it('should return 200 OK with health details', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.service).toBe('BlastGuard Application API');
    });
  });

  describe('POST /api/requests', () => {
    it('should create a new change request with 201 Created', async () => {
      const payload = {
        action: 'DELETE',
        resourceId: 'subnet-99',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      };

      const res = await request(app).post('/api/requests').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.requestId).toBeDefined();
      expect(res.body.status).toBe('PENDING');
    });

    it('should return 400 Bad Request with standardized error on validation failure', async () => {
      const invalidPayload = {
        action: 'INVALID_ACTION',
        resourceId: 'subnet-07',
      };

      const res = await request(app).post('/api/requests').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('INVALID_REQUEST');
      expect(res.body.error.message).toContain('Allowed actions');
    });
  });

  describe('GET /api/requests', () => {
    it('should list all change requests', async () => {
      const res = await request(app).get('/api/requests');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('requestId');
      expect(res.body[0]).toHaveProperty('resourceId');
    });

    it('should filter requests by ?status=BLOCKED', async () => {
      const res = await request(app).get('/api/requests?status=BLOCKED');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((item: { status: string }) => {
        expect(item.status).toBe('BLOCKED');
      });
    });
  });

  describe('GET /api/requests/:requestId', () => {
    it('should return 200 with full details and analysis for req_01', async () => {
      const res = await request(app).get('/api/requests/req_01');

      expect(res.status).toBe(200);
      expect(res.body.requestId).toBe('req_01');
      expect(res.body.resourceId).toBe('subnet-07');
      expect(res.body.status).toBe('BLOCKED');
      expect(res.body.analysis).toBeDefined();
      expect(res.body.analysis.riskScore).toBe(87);
      expect(res.body.analysis.decision).toBe('BLOCK');
      expect(res.body.analysis.affectedResources).toBe(11);
      expect(res.body.analysis.criticalServices).toBe(3);
    });

    it('should return 404 with standardized error for non-existent requestId', async () => {
      const res = await request(app).get('/api/requests/req_non_existent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('POST /api/requests/:requestId/analyze', () => {
    it('should trigger analysis and return Person 1 analysis result', async () => {
      // 1. Create a fresh request
      const createRes = await request(app).post('/api/requests').send({
        action: 'DELETE',
        resourceId: 'subnet-prod-02',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      });

      const { requestId } = createRes.body;

      // 2. Trigger analyze
      const analyzeRes = await request(app).post(`/api/requests/${requestId}/analyze`);

      expect(analyzeRes.status).toBe(200);
      expect(analyzeRes.body.requestId).toBe(requestId);
      expect(analyzeRes.body.decision).toBe('BLOCK');
      expect(analyzeRes.body.riskScore).toBe(87);
      expect(analyzeRes.body.affectedResources).toBe(11);
      expect(analyzeRes.body.criticalServices).toBe(3);
      expect(analyzeRes.body.summary).toContain('delete a subnet in a production VPC');

      // 3. Verify status in GET
      const getRes = await request(app).get(`/api/requests/${requestId}`);
      expect(getRes.body.status).toBe('BLOCKED');
    });

    it('should return 404 when analyzing a non-existent request', async () => {
      const res = await request(app).post('/api/requests/req_missing/analyze');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 standard error for undefined routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });
});
