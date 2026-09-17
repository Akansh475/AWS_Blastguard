import { ImpactGraph } from '../models/ImpactGraph';
import { Resource } from '../models/Resource';
import { TopologyEdge } from '../models/TopologyEdge';
import { TopologyNode } from '../models/TopologyNode';
import { getResourceProvider, ResourceProvider } from '../providers';
import { logger } from '../utils/logger';
import { dependencyAnalysisService, DependencyAnalysisService } from './DependencyAnalysisService';

export class TopologyAnalysisService {
  private dependencyService: DependencyAnalysisService;
  private provider: ResourceProvider;

  constructor(dependencyService?: DependencyAnalysisService, provider?: ResourceProvider) {
    this.dependencyService = dependencyService || dependencyAnalysisService;
    this.provider = provider || getResourceProvider();
  }

  private mapResourceToNode(resource: Resource): TopologyNode {
    return {
      id: resource.id,
      name: resource.name,
      label: resource.name,
      type: resource.type,
      environment: resource.environment,
      criticality: resource.criticality,
      region: resource.region,
      isExternal: resource.isExternal,
      data: {
        arn: resource.arn,
        tags: resource.tags,
        metadata: resource.metadata,
      },
    };
  }

  /**
   * Generates the topology graph containing nodes, edges, affectedNodes, criticalNodes, and externalNodes.
   */
  async buildTopology(resourceId: string): Promise<ImpactGraph> {
    logger.info(`TopologyAnalysisService: Generating topology for ${resourceId}`);

    const analysis = await this.dependencyService.analyzeDependencies(resourceId);
    const affectedResourceIds = new Set(analysis.totalAffectedResources.map((r) => r.id));

    // Map resources to TopologyNode format
    const nodes: TopologyNode[] = analysis.totalAffectedResources.map((r) =>
      this.mapResourceToNode(r)
    );
    const affectedNodes: TopologyNode[] = [...nodes];
    const criticalNodes: TopologyNode[] = analysis.criticalServices.map((r) =>
      this.mapResourceToNode(r)
    );
    const externalNodes: TopologyNode[] = analysis.externalDependencies.map((r) =>
      this.mapResourceToNode(r)
    );

    // Retrieve and filter edges that exist within the affected subgraph
    const edgesMap = new Map<string, TopologyEdge>();

    for (const res of analysis.totalAffectedResources) {
      const deps = await this.provider.getDependencies(res.id);
      for (const dep of deps) {
        const source = dep.source || dep.sourceResourceId || '';
        const target = dep.target || dep.targetResourceId || '';

        // Only include edge if both endpoints are in the affected subgraph
        if (affectedResourceIds.has(source) && affectedResourceIds.has(target)) {
          const key = `${source}->${target}`;
          if (!edgesMap.has(key)) {
            edgesMap.set(key, {
              id: `edge-${edgesMap.size + 1}`,
              source,
              target,
              relationship: dep.relationship,
              label: dep.description,
            });
          }
        }
      }
    }

    const edges = Array.from(edgesMap.values());

    return {
      rootResourceId: resourceId,
      nodes,
      edges,
      affectedNodes,
      criticalNodes,
      externalNodes,
      blastRadiusCount: nodes.length,
      directImpactCount: analysis.directDependencies.length,
      indirectImpactCount: analysis.indirectDependencies.length,
      depth: analysis.indirectDependencies.length > 0 ? 2 : 1,
      criticalServicesCount: criticalNodes.length,
      externalDependenciesCount: externalNodes.length,
    };
  }
}

export const topologyAnalysisService = new TopologyAnalysisService();
