export type PolicySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  severity: PolicySeverity;
  description: string;
  nonCompliantResource: string;
  guidelineUrl?: string;
}
