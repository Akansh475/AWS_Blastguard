import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('Stage 2: Resource API & Impact API Endpoints', () => {
  it('GET /api/resources/:resourceId returns the resource for subnet-07', async () => {
    const res = await request(app).get('/api/resources/subnet-07');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({
      id: 'subnet-07',
      name: 'subnet-07',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
    });
  });

  it('GET /api/resources/:resourceId returns 404 for non-existent resource', async () => {
    const res = await request(app).get('/api/resources/subnet-999-missing');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: "Resource with ID 'subnet-999-missing' not found",
      },
    });
  });

  it('GET /api/resources lists all ~20 mock AWS resources', async () => {
    const res = await request(app).get('/api/resources');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBe(20);
    expect(res.body.meta.total).toBe(20);
  });

  it('GET /api/resources/:resourceId/dependencies returns direct dependencies', async () => {
    const res = await request(app).get('/api/resources/subnet-07/dependencies');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('CRITICAL TEST: GET /api/requests/:requestId/impact for subnet-07 returns 11 affected, 3 critical, and 2 external nodes', async () => {
    // 1. Create proposed change request for DELETE subnet-07
    const createRes = await request(app)
      .post('/api/requests')
      .send({
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        details: { reason: 'Demolishing subnet-07' },
      });

    expect(createRes.status).toBe(201);
    const requestId = createRes.body.data.id;

    // 2. Query impact endpoint
    const impactRes = await request(app).get(`/api/requests/${requestId}/impact`);

    expect(impactRes.status).toBe(200);
    expect(impactRes.body).toHaveProperty('data');
    const impact = impactRes.body.data;

    expect(impact.rootResourceId).toBe('subnet-07');
    expect(impact.blastRadiusCount).toBe(11);
    expect(impact.affectedNodes.length).toBe(11);
    expect(impact.criticalNodes.length).toBe(3);
    expect(impact.externalNodes.length).toBe(2);

    // Verify critical nodes
    const criticalNodeIds = impact.criticalNodes.map((n: { id: string }) => n.id);
    expect(criticalNodeIds).toContain('payment-api');
    expect(criticalNodeIds).toContain('payment-worker');
    expect(criticalNodeIds).toContain('payment-notifier');

    // Verify external nodes
    const externalNodeIds = impact.externalNodes.map((n: { id: string }) => n.id);
    expect(externalNodeIds).toContain('production-load-balancer');
    expect(externalNodeIds).toContain('external-payment-gateway');

    // Verify node attributes
    impact.nodes.forEach((n: { id: string; name: string; type: string; environment: string; criticality: string }) => {
      expect(n.id).toBeDefined();
      expect(n.name).toBeDefined();
      expect(n.type).toBeDefined();
      expect(n.environment).toBeDefined();
      expect(n.criticality).toBeDefined();
    });

    // Verify edge attributes
    impact.edges.forEach((e: { source: string; target: string; relationship: string }) => {
      expect(e.source).toBeDefined();
      expect(e.target).toBeDefined();
      expect(e.relationship).toBeDefined();
    });
  });
});
