import { describe, expect, it } from 'vitest';
import { MockResourceProvider } from '../src/providers/MockResourceProvider';

describe('MockResourceProvider', () => {
  const provider = new MockResourceProvider();

  it('getResource retrieves resource details by ID', async () => {
    const resource = await provider.getResource('subnet-07');

    expect(resource).not.toBeNull();
    expect(resource?.id).toBe('subnet-07');
    expect(resource?.type).toBe('Subnet');
    expect(resource?.environment).toBe('PRODUCTION');
    expect(resource?.criticality).toBe('CRITICAL');
    expect(resource?.region).toBe('ap-south-1');
  });

  it('getResource returns null for non-existent resource', async () => {
    const resource = await provider.getResource('subnet-unknown-404');
    expect(resource).toBeNull();
  });

  it('listResources returns full mock inventory', async () => {
    const all = await provider.listResources();
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it('listResources filters by type', async () => {
    const subnets = await provider.listResources({ type: 'Subnet' });
    expect(subnets.length).toBeGreaterThan(0);
    subnets.forEach((s) => expect(s.type).toBe('Subnet'));
  });

  it('listResources filters by criticality', async () => {
    const critical = await provider.listResources({ criticality: 'CRITICAL' });
    expect(critical.length).toBeGreaterThan(0);
    critical.forEach((r) => expect(r.criticality).toBe('CRITICAL'));
  });

  it('getDependencies returns both incoming and outgoing dependencies for a resource', async () => {
    const deps = await provider.getDependencies('subnet-07');
    expect(deps.length).toBeGreaterThan(0);

    const connectedIds = deps.flatMap((d) => [d.source, d.target, d.sourceResourceId, d.targetResourceId]);
    expect(connectedIds).toContain('subnet-07');
    expect(connectedIds).toContain('payment-api');
    expect(connectedIds).toContain('payment-worker');
  });

  it('getTopology returns a comprehensive graph of the infrastructure', async () => {
    const topology = await provider.getTopology();
    expect(topology.nodes.length).toBeGreaterThan(0);
    expect(topology.edges.length).toBeGreaterThan(0);
    expect(topology.blastRadiusCount).toBe(topology.nodes.length);
  });
});
