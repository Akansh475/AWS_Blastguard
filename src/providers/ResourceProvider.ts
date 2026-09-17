import { Criticality, Environment, Resource, ResourceType } from '../models/Resource';
import { Dependency } from '../models/Dependency';
import { ImpactGraph } from '../models/ImpactGraph';

export interface ResourceFilter {
  type?: ResourceType;
  region?: string;
  environment?: Environment;
  criticality?: Criticality;
}

export interface ResourceProvider {
  /**
   * Retrieve a single resource by its identifier
   */
  getResource(resourceId: string): Promise<Resource | null>;

  /**
   * List all discovered or mock resources, optionally filtered
   */
  listResources(filter?: ResourceFilter): Promise<Resource[]>;

  /**
   * Retrieve direct and immediate dependencies for a given resource
   */
  getDependencies(resourceId: string): Promise<Dependency[]>;

  /**
   * Retrieve the complete topology representation as an ImpactGraph
   */
  getTopology(): Promise<ImpactGraph>;
}
