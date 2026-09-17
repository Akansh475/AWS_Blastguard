import { Criticality, Environment, ResourceType } from './Resource';

export interface TopologyNode {
  id: string;
  name: string;
  type: ResourceType;
  environment: Environment;
  criticality: Criticality;
  label?: string;
  region?: string;
  isExternal?: boolean;
  data?: Record<string, unknown>;
}
