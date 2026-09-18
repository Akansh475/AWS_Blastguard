import { ChangeStatus } from './ChangeRequest';
import { Dependency } from './Dependency';
import { ImpactGraph } from './ImpactGraph';
import { PolicyViolation } from './PolicyViolation';
import { RiskDecision, RiskLevel } from './RiskResult';
import { SecurityFinding } from './SecurityFinding';
import { TopologyEdge } from './TopologyEdge';
import { TopologyNode } from './TopologyNode';

export interface RiskBreakdown {
  dependencyRisk: number;
  criticalityRisk: number;
  securityRisk: number;
  policyRisk: number;
  environmentRisk: number;
  total: number;
}

export interface AnalysisTopology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface AnalysisResult {
  // Required Stage 4 finalized contract fields for Person 2
  requestId: string;
  resourceId: string;
  riskScore: number;
  severity: RiskLevel;
  decision: RiskDecision;
  affectedResources: number;
  criticalServices: number;
  externalDependencies: number;
  riskBreakdown: RiskBreakdown;
  reasons: string[];
  securityFindings: SecurityFinding[];
  policyViolations: PolicyViolation[];
  dependencies: Dependency[];
  topology: AnalysisTopology;

  // Backwards compatibility fields preserved for earlier stages & integrations
  id?: string;
  status?: ChangeStatus;
  riskLevel?: RiskLevel;
  blastRadius?: number;
  impactGraph?: ImpactGraph;
  summary?: string;
  recommendations?: string[];
  analyzedAt?: string;
  metadata?: Record<string, unknown>;
}
