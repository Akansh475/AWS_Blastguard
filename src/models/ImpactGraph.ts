import { TopologyEdge } from './TopologyEdge';
import { TopologyNode } from './TopologyNode';

export interface ImpactGraph {
  rootResourceId: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  blastRadiusCount: number;
  directImpactCount: number;
  indirectImpactCount: number;
  depth?: number;
}
