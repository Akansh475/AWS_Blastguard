import { describe, expect, it } from 'vitest';
import { dependencyAnalysisService } from '../src/services/DependencyAnalysisService';
import { topologyAnalysisService } from '../src/services/TopologyAnalysisService';
import { MockResourceProvider } from '../src/providers/MockResourceProvider';

describe('Stage 2: Dependency Engine & Topology Analysis', () => {
  const provider = new MockResourceProvider();

  it('CRITICAL TEST: DELETE subnet-07 produces 11 affected resources, 3 critical services, and 2 external dependencies', async () => {
    const analysis = await dependencyAnalysisService.analyzeDependencies('subnet-07');

    // 1. Exactly 11 total affected resources emerge from graph traversal
    expect(analysis.affectedCount).toBe(11);
    expect(analysis.totalAffectedResources.length).toBe(11);

    const affectedIds = analysis.totalAffectedResources.map((r) => r.id);
    expect(affectedIds).toContain('subnet-07');
    expect(affectedIds).toContain('payment-api');
    expect(affectedIds).toContain('payment-worker');
    expect(affectedIds).toContain('payment-db');
    expect(affectedIds).toContain('payment-notifier');
    expect(affectedIds).toContain('payment-security-group');
    expect(affectedIds).toContain('payment-data-bucket');
    expect(affectedIds).toContain('iam-payment-role');
    expect(affectedIds).toContain('order-service');
    expect(affectedIds).toContain('production-load-balancer');
    expect(affectedIds).toContain('external-payment-gateway');

    // 2. Exactly 3 critical services
    expect(analysis.criticalServicesCount).toBe(3);
    expect(analysis.criticalServices.length).toBe(3);
    const criticalServiceIds = analysis.criticalServices.map((r) => r.id);
    expect(criticalServiceIds).toContain('payment-api');
    expect(criticalServiceIds).toContain('payment-worker');
    expect(criticalServiceIds).toContain('payment-notifier');

    // Verify all 3 are compute workloads with CRITICAL criticality
    analysis.criticalServices.forEach((service) => {
      expect(['EC2', 'ECS', 'Lambda']).toContain(service.type);
      expect(service.criticality).toBe('CRITICAL');
    });

    // 3. Exactly 2 external dependencies
    expect(analysis.externalDependenciesCount).toBe(2);
    expect(analysis.externalDependencies.length).toBe(2);
    const externalIds = analysis.externalDependencies.map((r) => r.id);
    expect(externalIds).toContain('production-load-balancer');
    expect(externalIds).toContain('external-payment-gateway');
    analysis.externalDependencies.forEach((ext) => {
      expect(ext.isExternal).toBe(true);
    });
  });

  it('correctly partitions direct and indirect dependencies for subnet-07', async () => {
    const analysis = await dependencyAnalysisService.analyzeDependencies('subnet-07');

    // Direct dependencies hosted in subnet-07
    const directIds = analysis.directDependencies.map((r) => r.id);
    expect(directIds).toContain('payment-api');
    expect(directIds).toContain('payment-worker');
    expect(analysis.directDependencies.length).toBe(2);

    // Indirect dependencies (downstream/upstream through payment-api & payment-worker)
    expect(analysis.indirectDependencies.length).toBe(8);
    const indirectIds = analysis.indirectDependencies.map((r) => r.id);
    expect(indirectIds).toContain('payment-db');
    expect(indirectIds).toContain('payment-notifier');
    expect(indirectIds).toContain('payment-security-group');
    expect(indirectIds).toContain('payment-data-bucket');
    expect(indirectIds).toContain('iam-payment-role');
    expect(indirectIds).toContain('order-service');
    expect(indirectIds).toContain('production-load-balancer');
    expect(indirectIds).toContain('external-payment-gateway');
  });

  it('safely handles cyclic graph loops without infinite recursion', async () => {
    // payment-api <-> payment-notifier forms a cycle in the mock graph
    const analysis = await dependencyAnalysisService.analyzeDependencies('payment-api');

    expect(analysis.affectedCount).toBeGreaterThan(0);
    // Every affected resource must appear only once in totalAffectedResources
    const ids = analysis.totalAffectedResources.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('throws NotFoundError for non-existent resource in dependency analysis', async () => {
    await expect(
      dependencyAnalysisService.analyzeDependencies('subnet-does-not-exist')
    ).rejects.toThrow(/Resource with ID 'subnet-does-not-exist' not found/);
  });

  it('TopologyAnalysisService generates complete topology graph with required node and edge structure', async () => {
    const topology = await topologyAnalysisService.buildTopology('subnet-07');

    expect(topology.rootResourceId).toBe('subnet-07');
    expect(topology.blastRadiusCount).toBe(11);
    expect(topology.affectedNodes.length).toBe(11);
    expect(topology.criticalNodes.length).toBe(3);
    expect(topology.externalNodes.length).toBe(2);
    expect(topology.edges.length).toBeGreaterThan(0);

    // Verify node structure: id, name, type, environment, criticality
    topology.nodes.forEach((node) => {
      expect(node.id).toBeDefined();
      expect(node.name).toBeDefined();
      expect(node.type).toBeDefined();
      expect(node.environment).toBeDefined();
      expect(node.criticality).toBeDefined();
    });

    // Verify edge structure: source, target, relationship
    topology.edges.forEach((edge) => {
      expect(edge.source).toBeDefined();
      expect(edge.target).toBeDefined();
      expect(edge.relationship).toBeDefined();
    });
  });

  it('MockResourceProvider has approximately 20 resources with expected names', async () => {
    const all = await provider.listResources();
    expect(all.length).toBe(20);

    const ids = all.map((r) => r.id);
    expect(ids).toContain('vpc-prod');
    expect(ids).toContain('subnet-07');
    expect(ids).toContain('subnet-08');
    expect(ids).toContain('payment-api');
    expect(ids).toContain('payment-worker');
    expect(ids).toContain('payment-db');
    expect(ids).toContain('payment-notifier');
    expect(ids).toContain('order-service');
    expect(ids).toContain('order-db');
    expect(ids).toContain('notification-service');
    expect(ids).toContain('production-load-balancer');
    expect(ids).toContain('payment-security-group');
    expect(ids).toContain('payment-data-bucket');
  });
});
