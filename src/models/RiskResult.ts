export type RiskDecision = 'SAFE' | 'REVIEW' | 'BLOCK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskResult {
  score: number;
  level: RiskLevel;
  decision: RiskDecision;
  factors: string[];
  blastRadius: number;
}
