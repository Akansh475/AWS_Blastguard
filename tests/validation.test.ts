import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('API Validation & Error Handling', () => {
  it('rejects request with missing required fields with 400 and VALIDATION_ERROR code', async () => {
    const res = await request(app).post('/api/requests').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Validation failed');
    expect(Array.isArray(res.body.error.details)).toBe(true);

    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('action');
    expect(fields).toContain('resourceId');
    expect(fields).toContain('resourceType');
    expect(fields).toContain('region');
    expect(fields).toContain('environment');
  });

  it('rejects invalid action with 400', async () => {
    const res = await request(app).post('/api/requests').send({
      action: 'DESTROY',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const actionError = res.body.error.details.find((d: { field: string }) => d.field === 'action');
    expect(actionError).toBeDefined();
  });

  it('rejects invalid resourceType with 400', async () => {
    const res = await request(app).post('/api/requests').send({
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'KubernetesCluster',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const typeError = res.body.error.details.find((d: { field: string }) => d.field === 'resourceType');
    expect(typeError).toBeDefined();
  });

  it('rejects invalid environment with 400', async () => {
    const res = await request(app).post('/api/requests').send({
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'LOCAL',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const envError = res.body.error.details.find((d: { field: string }) => d.field === 'environment');
    expect(envError).toBeDefined();
  });

  it('rejects empty string resourceId with 400', async () => {
    const res = await request(app).post('/api/requests').send({
      action: 'DELETE',
      resourceId: '   ',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns consistent error format for non-existent route (404)', async () => {
    const res = await request(app).get('/api/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: "Route 'GET /api/unknown-endpoint' not found",
      },
    });
  });
});
