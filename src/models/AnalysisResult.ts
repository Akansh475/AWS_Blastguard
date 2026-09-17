import { ChangeStatus } from './ChangeRequest';
import { ImpactGraph } from './ImpactGraph';
import { PolicyViolation } from './PolicyViolation';
import { RiskDecision, RiskLevel } from './RiskResult';
import { SecurityFinding } from './SecurityFinding';

export interface AnalysisResult {
  id: string;
  requestId: string;
  status: ChangeStatus;
  decision: RiskDecision;
  riskScore: number;
  riskLevel: RiskLevel;
  blastRadius: number;
  impactGraph: ImpactGraph;
  securityFindings: SecurityFinding[];
  policyViolations: PolicyViolation[];
  summary: string;
  recommendations: string[];
  analyzedAt: string;
  metadata?: Record<string, unknown>;
}
