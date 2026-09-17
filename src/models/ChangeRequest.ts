import { Environment, ResourceType } from './Resource';

export type ChangeAction = 'CREATE' | 'UPDATE' | 'DELETE';

export type ChangeStatus =
  | 'PENDING'
  | 'ANALYZING'
  | 'SAFE'
  | 'REVIEW'
  | 'BLOCKED'
  | 'FAILED';

export interface ChangeRequest {
  id: string;
  action: ChangeAction;
  resourceId: string;
  resourceType: ResourceType;
  region: string;
  environment: Environment;
  status: ChangeStatus;
  createdAt: string;
  updatedAt: string;
  details?: Record<string, unknown>;
}

export interface CreateChangeRequestDTO {
  action: ChangeAction;
  resourceId: string;
  resourceType: ResourceType;
  region: string;
  environment: Environment;
  details?: Record<string, unknown>;
}

export const VALID_CHANGE_ACTIONS: ChangeAction[] = ['CREATE', 'UPDATE', 'DELETE'];

export const VALID_CHANGE_STATUSES: ChangeStatus[] = [
  'PENDING',
  'ANALYZING',
  'SAFE',
  'REVIEW',
  'BLOCKED',
  'FAILED',
];
