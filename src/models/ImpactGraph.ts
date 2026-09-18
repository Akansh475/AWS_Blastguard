import { TopologyEdge } from './TopologyEdge';
import { TopologyNode } from './TopologyNode';

export interface ImpactGraph {
  rootResourceId: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  affectedNodes: TopologyNode[];
  criticalNodes: TopologyNode[];
  externalNodes: TopologyNode[];
  blastRadiusCount: number;
  directImpactCount: number;
  indirectImpactCount: number;
  depth?: number;
  criticalServicesCount?: number;
  externalDependenciesCount?: number;
}
