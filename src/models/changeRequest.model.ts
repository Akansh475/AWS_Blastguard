import type { AnalysisResult, Decision, Severity } from './analysisResult.model';
import type { ExplanationResult } from '../ai/types/explanation.model';

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
  severity?: Severity;
  decision?: Decision;
  affectedResources?: number;
  criticalServices?: number;
  externalDependencies?: number;
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string;
  analysisResult?: AnalysisResult;
  aiExplanation?: ExplanationResult;
  aiExplanationGeneratedAt?: string;
  aiModel?: string;
  aiExplanationVersion?: string;
}



export interface RequestFilterOptions {
  status?: RequestStatus;
}
