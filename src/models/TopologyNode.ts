import { Criticality, Environment, ResourceType } from './Resource';

export interface TopologyNode {
  id: string;
  label: string;
  type: ResourceType;
  criticality: Criticality;
  environment: Environment;
  region: string;
  data?: Record<string, unknown>;
}
