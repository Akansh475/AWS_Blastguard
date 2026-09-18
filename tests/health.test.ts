import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('Health & Root Endpoints', () => {
  it('GET /api/health returns 200 OK with service status and configuration', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({
      status: 'OK',
      service: 'blastguard-core-api',
      version: '1.0.0',
      mode: 'mock',
      region: 'ap-south-1',
    });
    expect(res.body.data).toHaveProperty('timestamp');
    expect(typeof res.body.data.uptimeSeconds).toBe('number');
  });

  it('GET / returns 200 OK with API discovery metadata', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('BlastGuard Core Infrastructure Intelligence API');
    expect(res.body.stage).toBe(1);
    expect(res.body.endpoints).toBeDefined();
  });
});
