import { DependencyRelationship } from './Dependency';

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship: DependencyRelationship | string;
  label?: string;
}
