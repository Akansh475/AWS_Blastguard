export type DependencyRelationship =
  | 'CONTAINS'
  | 'DEPENDS_ON'
  | 'CONNECTS_TO'
  | 'ATTACHED_TO'
  | 'ROUTES_TO'
  | 'SECURED_BY'
  | 'PERMITS';

export interface Dependency {
  sourceResourceId: string;
  targetResourceId: string;
  relationship: DependencyRelationship;
  bidirectional?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}
