export type Action = 'CREATE' | 'UPDATE' | 'DELETE';

export type Environment = 'DEV' | 'STAGING' | 'PRODUCTION';

export type RequestStatus = 'PENDING' | 'ANALYZING' | 'SAFE' | 'REVIEW' | 'BLOCKED' | 'FAILED';

export interface CreateChangeRequestDTO {
  action: string;
  resourceId: string;
  resourceType: string;
  region: string;
  environment: string;
}

export interface ChangeRequest {
  requestId: string;
  action: Action;
  resourceId: string;
  resourceType: string;
  region: string;
  environment: Environment;
  status: RequestStatus;
  riskScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequestFilterOptions {
  status?: RequestStatus;
}
