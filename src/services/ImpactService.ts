import { ImpactGraph } from '../models/ImpactGraph';
import { Resource } from '../models/Resource';
import { TopologyEdge } from '../models/TopologyEdge';
import { TopologyNode } from '../models/TopologyNode';
import { getResourceProvider, ResourceProvider } from '../providers';
import { logger } from '../utils/logger';

export class ImpactService {
  private provider: ResourceProvider;

  constructor(provider?: ResourceProvider) {
    this.provider = provider || getResourceProvider();
  }

  async calculateImpact(resourceId: string): Promise<ImpactGraph> {
    logger.info(`ImpactService: Calculating impact graph for resource: ${resourceId}`);

    const rootResource = await this.provider.getResource(resourceId);
    const directDeps = await this.provider.getDependencies(resourceId);

    const directResourceIds = new Set<string>();
    directDeps.forEach((dep) => {
      if (dep.sourceResourceId !== resourceId) directResourceIds.add(dep.sourceResourceId);
      if (dep.targetResourceId !== resourceId) directResourceIds.add(dep.targetResourceId);
    });

    // Traverse 2nd degree dependencies for indirect impact
    const indirectResourceIds = new Set<string>();
    const allEdgesMap = new Map<string, TopologyEdge>();

    // Add direct edges
    directDeps.forEach((d, idx) => {
      const edgeId = `edge-direct-${idx + 1}`;
      allEdgesMap.set(`${d.sourceResourceId}->${d.targetResourceId}`, {
        id: edgeId,
        source: d.sourceResourceId,
        target: d.targetResourceId,
        relationship: d.relationship,
        label: d.description,
      });
    });

    for (const directId of directResourceIds) {
      const secondaryDeps = await this.provider.getDependencies(directId);
      for (const dep of secondaryDeps) {
        const otherId =
          dep.sourceResourceId === directId ? dep.targetResourceId : dep.sourceResourceId;
        if (otherId !== resourceId && !directResourceIds.has(otherId)) {
          indirectResourceIds.add(otherId);
        }
        const key = `${dep.sourceResourceId}->${dep.targetResourceId}`;
        if (!allEdgesMap.has(key)) {
          allEdgesMap.set(key, {
            id: `edge-indirect-${allEdgesMap.size + 1}`,
            source: dep.sourceResourceId,
            target: dep.targetResourceId,
            relationship: dep.relationship,
            label: dep.description,
          });
        }
      }
    }

    // Collect all involved resources
    const allResourceIds = new Set([resourceId, ...directResourceIds, ...indirectResourceIds]);
    const nodes: TopologyNode[] = [];

    for (const id of allResourceIds) {
      const res = await this.provider.getResource(id);
      if (res) {
        nodes.push({
          id: res.id,
          label: res.name,
          type: res.type,
          criticality: res.criticality,
          environment: res.environment,
          region: res.region,
          data: { arn: res.arn, tags: res.tags },
        });
      } else {
        // Fallback node if resource metadata is absent from catalog
        nodes.push({
          id,
          label: id,
          type: 'EC2',
          criticality: 'MEDIUM',
          environment: 'DEV',
          region: 'ap-south-1',
        });
      }
    }

    const blastRadiusCount = nodes.length;
    const directImpactCount = directResourceIds.size;
    const indirectImpactCount = indirectResourceIds.size;

    return {
      rootResourceId: resourceId,
      nodes,
      edges: Array.from(allEdgesMap.values()),
      blastRadiusCount,
      directImpactCount,
      indirectImpactCount,
      depth: indirectResourceIds.size > 0 ? 2 : directResourceIds.size > 0 ? 1 : 0,
    };
  }
}

export const impactService = new ImpactService();
