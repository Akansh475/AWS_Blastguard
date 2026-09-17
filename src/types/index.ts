export interface InfraNode {
  id: string;
  name: string;
  type: 'vpc' | 'az' | 'subnet' | 'service' | 'database' | 'gateway' | 'worker' | 'monitoring' | 'auth';
  status: 'healthy' | 'warning' | 'critical' | 'analyzing';
  isOrigin?: boolean;
  isDirectImpact?: boolean;
  isIndirectImpact?: boolean;
  isCritical?: boolean;
  metrics?: {
    requests?: string;
    latency?: string;
    errorRate?: string;
    availability?: string;
    tier?: string;
  };
}

export interface InfraLink {
  id: string;
  source: string;
  target: string;
  isPrimaryDependency?: boolean;
  isSecondaryDependency?: boolean;
  isImpactPath?: boolean;
  type?: 'sync' | 'async' | 'network' | 'database';
}

export interface AgentPipelineStep {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'running' | 'completed' | 'alert';
  detail: string;
}

export interface SecurityCheck {
  category: string;
  status: 'PASS' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
}

export interface ChangeRequestItem {
  id: string;
  ticketId: string;
  action: 'DELETE' | 'MODIFY' | 'TERMINATE' | 'ROTATE';
  target: string;
  resourceType: string;
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  region: string;
  vpc: string;
  cidr?: string;
  requestedBy: string;
  requestedTime: string;
  status: 'ANALYZING' | 'BLOCKED' | 'APPROVED' | 'PENDING_APPROVAL';
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  directImpactCount: number;
  indirectImpactCount: number;
  trafficAtRisk: string;
  policyResult: 'VIOLATION' | 'COMPLIANT' | 'NEEDS_REVIEW';
  reason: string;
}

export type ScenePhase =
  | 'SECTION_01_HERO'
  | 'SECTION_02_CONNECTED'
  | 'SECTION_03_ONE_CHANGE'
  | 'SECTION_04_CAN_TRAVEL'
  | 'SECTION_05_WHAT_BREAKS'
  | 'SECTION_06_KNOW_FIRST'
  | 'SECTION_07_SAFETY_GATE'
  | 'SECTION_08_SEE_IMPACT'
  | 'SECTION_09_COMMAND_CENTER'
  // Editorial aliases
  | 'HERO'
  | 'THE_PROBLEM'
  | 'AWS_CONTEXT'
  | 'MEET_BLASTGUARD'
  | 'SIGNATURE_QUESTION'
  | 'CHANGE_REQUEST'
  | 'ANALYSIS_PIPELINE'
  | 'BLAST_RADIUS'
  | 'FINAL_DECISION'
  | 'FINAL_BRAND'
  // Legacy aliases
  | 'SCENE_BEFORE'
  | 'SCENE_CHANGE'
  | 'SCENE_WHAT_BREAKS'
  | 'SCENE_CONNECTED'
  | 'SCENE_KNOW_FIRST'
  | 'SCENE_SAFETY_GATE'
  | 'SCENE_REQUEST'
  | 'SCENE_SPECIALISTS'
  | 'SCENE_BLAST_RADIUS'
  | 'SCENE_DECISION'
  | 'SCENE_BRAND'
  | 'INTRO'
  | 'DEPENDENCY_DISCOVERY'
  | 'AGENT_ANALYSIS'
  | 'BLAST_RADIUS_TOPOLOGY'
  | 'RISK_ANALYSIS'
  | 'GOVERNANCE'
  | 'FINAL_PRODUCT';
