import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('Change Requests API', () => {
  let createdRequestId: string;

  it('POST /api/requests creates a valid ChangeRequest with PENDING status', async () => {
    const payload = {
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      details: {
        reason: 'Legacy subnet decommissioning',
      },
    };

    const res = await request(app).post('/api/requests').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    const data = res.body.data;
    expect(data.id).toMatch(/^cr-/);
    expect(data.action).toBe('DELETE');
    expect(data.resourceId).toBe('subnet-07');
    expect(data.resourceType).toBe('Subnet');
    expect(data.region).toBe('ap-south-1');
    expect(data.environment).toBe('PRODUCTION');
    expect(data.status).toBe('PENDING');
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.details).toEqual({ reason: 'Legacy subnet decommissioning' });

    createdRequestId = data.id;
  });

  it('GET /api/requests lists all requests including the newly created one', async () => {
    const res = await request(app).get('/api/requests');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty('total');
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);

    const found = res.body.data.find((r: { id: string }) => r.id === createdRequestId);
    expect(found).toBeDefined();
    expect(found.resourceId).toBe('subnet-07');
  });

  it('GET /api/requests/:requestId retrieves the request by its ID', async () => {
    const res = await request(app).get(`/api/requests/${createdRequestId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdRequestId);
    expect(res.body.data.resourceId).toBe('subnet-07');
    expect(res.body.data.status).toBe('PENDING');
  });

  it('GET /api/requests/:requestId returns 404 NOT_FOUND for unknown requestId', async () => {
    const nonExistentId = 'cr-missing-99999';
    const res = await request(app).get(`/api/requests/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: `ChangeRequest with ID '${nonExistentId}' not found`,
      },
    });
  });

  it('GET /api/requests/:requestId/impact returns computed impact graph for resource', async () => {
    const res = await request(app).get(`/api/requests/${createdRequestId}/impact`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    const impact = res.body.data;
    expect(impact.rootResourceId).toBe('subnet-07');
    expect(Array.isArray(impact.nodes)).toBe(true);
    expect(Array.isArray(impact.edges)).toBe(true);
    expect(typeof impact.blastRadiusCount).toBe('number');
    expect(typeof impact.directImpactCount).toBe('number');
    expect(typeof impact.indirectImpactCount).toBe('number');
    expect(impact.blastRadiusCount).toBeGreaterThan(0);
  });

  it('GET /api/requests/:requestId/impact returns 404 for unknown requestId', async () => {
    const res = await request(app).get('/api/requests/cr-non-existent/impact');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('POST /api/requests/:requestId/analyze returns placeholder AnalysisResult complying with data contract', async () => {
    const res = await request(app).post(`/api/requests/${createdRequestId}/analyze`).send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    const analysis = res.body.data;
    expect(analysis.id).toMatch(/^an-/);
    expect(analysis.requestId).toBe(createdRequestId);
    expect(['SAFE', 'REVIEW', 'BLOCK']).toContain(analysis.decision);
    expect(typeof analysis.riskScore).toBe('number');
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(analysis.riskLevel);
    expect(typeof analysis.blastRadius).toBe('number');
    expect(analysis.impactGraph).toBeDefined();
    expect(Array.isArray(analysis.securityFindings)).toBe(true);
    expect(Array.isArray(analysis.policyViolations)).toBe(true);
    expect(typeof analysis.summary).toBe('string');
    expect(Array.isArray(analysis.recommendations)).toBe(true);
    expect(analysis.analyzedAt).toBeDefined();
  });

  it('POST /api/requests/:requestId/analyze returns 404 for unknown requestId', async () => {
    const res = await request(app).post('/api/requests/cr-non-existent/analyze').send();

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
