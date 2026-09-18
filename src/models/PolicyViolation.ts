export type PolicySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PolicyViolation {
  policyId: string;
  severity: PolicySeverity;
  message: string;
  resourceId: string;
  id?: string;
  policyName?: string;
  description?: string;
  nonCompliantResource?: string;
  guidelineUrl?: string;
}
