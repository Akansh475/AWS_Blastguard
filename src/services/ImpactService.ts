import { ImpactGraph } from '../models/ImpactGraph';
import { getResourceProvider, ResourceProvider } from '../providers';
import { logger } from '../utils/logger';
import { topologyAnalysisService, TopologyAnalysisService } from './TopologyAnalysisService';

export class ImpactService {
  private topologyService: TopologyAnalysisService;
  private provider: ResourceProvider;

  constructor(topologyService?: TopologyAnalysisService, provider?: ResourceProvider) {
    this.topologyService = topologyService || topologyAnalysisService;
    this.provider = provider || getResourceProvider();
  }

  async calculateImpact(resourceId: string): Promise<ImpactGraph> {
    logger.info(`ImpactService: Calculating impact graph for resource: ${resourceId}`);

    const rootResource = await this.provider.getResource(resourceId);

    if (rootResource) {
      return this.topologyService.buildTopology(resourceId);
    }

    // Fallback for ad-hoc or non-existent resource in change requests
    return {
      rootResourceId: resourceId,
      nodes: [
        {
          id: resourceId,
          name: resourceId,
          label: resourceId,
          type: 'EC2',
          criticality: 'MEDIUM',
          environment: 'DEV',
          region: 'ap-south-1',
        },
      ],
      edges: [],
      affectedNodes: [
        {
          id: resourceId,
          name: resourceId,
          label: resourceId,
          type: 'EC2',
          criticality: 'MEDIUM',
          environment: 'DEV',
          region: 'ap-south-1',
        },
      ],
      criticalNodes: [],
      externalNodes: [],
      blastRadiusCount: 1,
      directImpactCount: 0,
      indirectImpactCount: 0,
      depth: 0,
      criticalServicesCount: 0,
      externalDependenciesCount: 0,
    };
  }
}

export const impactService = new ImpactService();
