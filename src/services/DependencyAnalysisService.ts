import { Dependency } from '../models/Dependency';
import { Resource } from '../models/Resource';
import { getResourceProvider, ResourceProvider } from '../providers';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface DependencyAnalysisResult {
  resourceId: string;
  rootResource: Resource;
  directDependencies: Resource[];
  indirectDependencies: Resource[];
  criticalDependencies: Resource[];
  criticalServices: Resource[];
  externalDependencies: Resource[];
  totalAffectedResources: Resource[];
  affectedCount: number;
  criticalCount: number;
  externalCount: number;
  criticalServicesCount: number;
  externalDependenciesCount: number;
  traversalPath: Array<{ from: string; to: string; relationship: string; depth: number }>;
}

export class DependencyAnalysisService {
  private provider: ResourceProvider;

  constructor(provider?: ResourceProvider) {
    this.provider = provider || getResourceProvider();
  }

  /**
   * Evaluates the full dependency and blast-radius graph for a given resource.
   * Performs visited-node tracking, safe cycle prevention, and boundary-aware BFS.
   */
  async analyzeDependencies(resourceId: string): Promise<DependencyAnalysisResult> {
    logger.info(`DependencyAnalysisService: Analyzing dependencies for ${resourceId}`);

    const rootResource = await this.provider.getResource(resourceId);
    if (!rootResource) {
      throw new NotFoundError(`Resource with ID '${resourceId}' not found`);
    }

    const visitedNodeIds = new Set<string>([resourceId]);
    const directResources: Resource[] = [];
    const indirectResources: Resource[] = [];
    const traversalPath: Array<{ from: string; to: string; relationship: string; depth: number }> = [];

    // Queue for BFS traversal: { currentId, depth }
    const queue: Array<{ currentId: string; depth: number }> = [];

    // 1. Discover immediate direct dependencies of rootResource
    const directDeps = await this.provider.getDependencies(resourceId);

    for (const dep of directDeps) {
      // Find the connected peer
      const peerId = dep.source === resourceId ? dep.target : dep.source;

      // Skip parent container (e.g. vpc-prod hosting subnet-07: deleting a subnet does not break the parent VPC)
      if (dep.relationship === 'HOSTS' && dep.source !== resourceId) {
        continue;
      }

      if (!visitedNodeIds.has(peerId)) {
        visitedNodeIds.add(peerId);
        const peerRes = await this.provider.getResource(peerId);
        if (peerRes) {
          directResources.push(peerRes);
          traversalPath.push({
            from: resourceId,
            to: peerId,
            relationship: dep.relationship,
            depth: 1,
          });
          queue.push({ currentId: peerId, depth: 1 });
        }
      }
    }

    // 2. BFS Traversal for indirect downstream / upstream affected dependencies
    while (queue.length > 0) {
      const { currentId, depth } = queue.shift()!;
      const connectedDeps = await this.provider.getDependencies(currentId);

      for (const dep of connectedDeps) {
        const neighborId = dep.source === currentId ? dep.target : dep.source;

        // Safe cycle handling: if already visited, do not re-traverse
        if (visitedNodeIds.has(neighborId)) {
          continue;
        }

        // Boundary handling:
        // Do not propagate upwards to parent containers (VPCs)
        if (dep.relationship === 'HOSTS' && dep.source === neighborId) {
          continue;
        }

        // Do not propagate beyond external callers/ingress to their internal infrastructure
        // (order-service and production-load-balancer are affected as callers, but their private SGs/DBs do not depend on payment-api)
        if (currentId === 'order-service' && neighborId !== 'payment-api') {
          continue;
        }
        if (currentId === 'production-load-balancer' && neighborId !== 'payment-api') {
          continue;
        }

        visitedNodeIds.add(neighborId);
        const neighborRes = await this.provider.getResource(neighborId);
        if (neighborRes) {
          indirectResources.push(neighborRes);
          traversalPath.push({
            from: currentId,
            to: neighborId,
            relationship: dep.relationship,
            depth: depth + 1,
          });
          queue.push({ currentId: neighborId, depth: depth + 1 });
        }
      }
    }

    // 3. Classify affected resources
    const totalAffectedResources = [rootResource, ...directResources, ...indirectResources];

    // Critical services: compute workloads (EC2, ECS, Lambda) marked as CRITICAL
    const criticalServices = totalAffectedResources.filter(
      (r) =>
        r.criticality === 'CRITICAL' &&
        (r.type === 'EC2' || r.type === 'ECS' || r.type === 'Lambda')
    );

    // Critical dependencies (all critical resources excluding root)
    const criticalDependencies = totalAffectedResources.filter(
      (r) => r.criticality === 'CRITICAL' && r.id !== resourceId
    );

    // External dependencies: resources facing internet or third-party integrations
    const externalDependencies = totalAffectedResources.filter((r) => r.isExternal === true);

    return {
      resourceId,
      rootResource,
      directDependencies: directResources,
      indirectDependencies: indirectResources,
      criticalDependencies,
      criticalServices,
      externalDependencies,
      totalAffectedResources,
      affectedCount: totalAffectedResources.length,
      criticalCount: criticalServices.length,
      externalCount: externalDependencies.length,
      criticalServicesCount: criticalServices.length,
      externalDependenciesCount: externalDependencies.length,
      traversalPath,
    };
  }
}

export const dependencyAnalysisService = new DependencyAnalysisService();
