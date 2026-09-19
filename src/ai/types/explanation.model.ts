import { Severity, Decision, PolicyViolation, SecurityFinding, Dependency } from '../../models/analysisResult.model';
import { Action, Environment } from '../../models/changeRequest.model';

/**
 * Sanitized, structured input passed to Amazon Bedrock for generating explanations.
 * Strictly decoupled from raw credentials and unneeded cloud metadata.
 */
export interface ExplanationInput {
  resource: {
    id: string;
    type: string;
    region: string;
    environment: Environment;
  };
  change: {
    action: Action;
  };
  risk: {
    score: number;
    severity: Severity;
    decision: Decision;
  };
  impact: {
    affectedResources: number;
    criticalServices: number;
    externalDependencies: number;
  };
  securityFindings: Array<{
    category: string;
    severity: string;
    details: string;
  }>;
  policyViolations: Array<{
    policyId: string;
    policyName: string;
    severity: string;
    description: string;
  }>;
  dependencies: Array<{
    id: string;
    name: string;
    type: string;
    tier: string;
    direct: boolean;
  }>;
}

/**
 * Structured, human-readable explanation produced by the AI Explanation Layer.
 */
export interface ExplanationResult {
  headline: string;
  summary: string;
  whyBlocked: string[] | string;
  impactSummary: string;
  impactExplanation?: string;
  riskExplanation: string;
  securityExplanation: string;
  policyExplanation: string;
  recommendedActions: string[];
  recommendedAction?: string;
  keyReasons: string[];
}


/**
 * Persistent record of an AI explanation attached to a ChangeRequest.
 */
export interface ExplanationRecord {
  requestId: string;
  explanation: ExplanationResult;
  generatedAt: string;
  model: string;
  version: string;
  isFallback?: boolean;
}
