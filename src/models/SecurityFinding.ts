export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityFinding {
  id: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  resourceId: string;
  affectedResourceId?: string;
  remediation?: string;
  ruleId?: string;
}
