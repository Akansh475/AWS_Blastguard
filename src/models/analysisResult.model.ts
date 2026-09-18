import { Action, RequestStatus } from './changeRequest.model';

export type Decision = 'ALLOW' | 'REVIEW' | 'BLOCK';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PolicyViolation {
  policyId: string;
  policyName: string;
  severity: Severity;
  description: string;
}

export interface SecurityFinding {
  category: string;
  severity: Severity;
  details: string;
}

export interface Dependency {
  id: string;
  name: string;
  type: string;
  tier: string;
  direct: boolean;
}

export interface ImpactGraphNode {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'critical' | 'analyzing';
  isOrigin?: boolean;
  isDirectImpact?: boolean;
  isIndirectImpact?: boolean;
  isCritical?: boolean;
}

export interface ImpactGraphLink {
  id: string;
  source: string;
  target: string;
  isPrimaryDependency?: boolean;
  isSecondaryDependency?: boolean;
  isImpactPath?: boolean;
  type?: string;
}

export interface ImpactGraph {
  nodes: ImpactGraphNode[];
  links: ImpactGraphLink[];
}

export interface AnalysisResult {
  requestId: string;
  resourceId: string;
  action: Action;
  status: RequestStatus;
  riskScore: number;
  severity: Severity;
  decision: Decision;
  affectedResources: number;
  criticalServices: number;
  externalDependencies: number;
  summary: string;
  policyViolations: PolicyViolation[];
  securityFindings: SecurityFinding[];
  dependencies: Dependency[];
  impactGraph: ImpactGraph;
  analyzedAt: string;
}
