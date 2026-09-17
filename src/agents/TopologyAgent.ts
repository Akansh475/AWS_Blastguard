import { ImpactGraph } from '../models/ImpactGraph';
import { topologyAnalysisService, TopologyAnalysisService } from '../services/TopologyAnalysisService';
import { logger } from '../utils/logger';

export interface ITopologyAgent {
  name: string;
  execute(resourceId: string): Promise<ImpactGraph>;
}

export class TopologyAgent implements ITopologyAgent {
  name = 'TopologyAgent';
  private service: TopologyAnalysisService;

  constructor(service?: TopologyAnalysisService) {
    this.service = service || topologyAnalysisService;
  }

  async execute(resourceId: string): Promise<ImpactGraph> {
    logger.info(`[${this.name}] Constructing deterministic topology graph for ${resourceId}`);
    return this.service.buildTopology(resourceId);
  }
}

export const topologyAgent = new TopologyAgent();
