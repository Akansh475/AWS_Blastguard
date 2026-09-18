import { Criticality } from './Resource';

export type DependencyRelationship =
  | 'HOSTS'
  | 'DEPENDS_ON'
  | 'CONNECTS_TO'
  | 'USES'
  | 'ROUTES_TO'
  | 'PROTECTED_BY'
  | 'STORES_IN'
  | 'CALLS'
  // Preserved for backwards compatibility
  | 'CONTAINS'
  | 'ATTACHED_TO'
  | 'SECURED_BY'
  | 'PERMITS';

export interface Dependency {
  source: string;
  target: string;
  sourceResourceId?: string;
  targetResourceId?: string;
  relationship: DependencyRelationship;
  direct?: boolean;
  criticality?: Criticality;
  bidirectional?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}
