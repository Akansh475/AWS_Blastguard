import { InfraNode, InfraLink, AgentPipelineStep, SecurityCheck, ChangeRequestItem } from '../types';

export const INFRA_NODES: InfraNode[] = [
  {
    id: 'subnet-07',
    name: 'subnet-07 (Prod-Network)',
    type: 'subnet',
    isOrigin: true,
    status: 'critical',
    metrics: { tier: 'Production Core', requests: '2.4M/hr' }
  },
  {
    id: 'payment-api',
    name: 'Payment API Service',
    type: 'service',
    isDirectImpact: true,
    isCritical: true,
    status: 'critical',
    metrics: { tier: 'Revenue Critical', requests: '2.4M/hr', latency: '184ms' }
  },
  {
    id: 'order-service',
    name: 'Order Fulfillment Core',
    type: 'service',
    isDirectImpact: true,
    isCritical: true,
    status: 'warning',
    metrics: { tier: 'Tier 1 Critical', requests: '1.8M/hr' }
  },
  {
    id: 'auth-broker',
    name: 'Authentication & Session Broker',
    type: 'auth',
    isDirectImpact: true,
    isCritical: true,
    status: 'critical',
    metrics: { tier: 'Tier 0 Security', requests: '3.1M/hr' }
  },
  {
    id: 'aurora-db',
    name: 'Production DB (Aurora PG Multi-AZ)',
    type: 'database',
    isIndirectImpact: true,
    isCritical: true,
    status: 'critical',
    metrics: { tier: 'Encrypted KMS', availability: '99.999%' }
  },
  {
    id: 'backup-vault',
    name: 'Disaster Recovery Backup Vault',
    type: 'database',
    isIndirectImpact: true,
    status: 'healthy',
    metrics: { tier: 'Immutable S3 Glacier' }
  },
  {
    id: 'monitoring-telemetry',
    name: 'CloudWatch / Datadog APM Ingress',
    type: 'monitoring',
    isIndirectImpact: true,
    status: 'warning',
    metrics: { tier: 'Observability' }
  }
];

export const INFRA_LINKS: InfraLink[] = [
  { id: 'l1', source: 'subnet-07', target: 'payment-api', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
  { id: 'l2', source: 'subnet-07', target: 'order-service', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
  { id: 'l3', source: 'subnet-07', target: 'auth-broker', isPrimaryDependency: true, isImpactPath: true, type: 'network' },
  { id: 'l4', source: 'payment-api', target: 'aurora-db', isPrimaryDependency: true, isImpactPath: true, type: 'database' },
  { id: 'l5', source: 'aurora-db', target: 'backup-vault', isSecondaryDependency: true, isImpactPath: true, type: 'database' },
  { id: 'l6', source: 'payment-api', target: 'monitoring-telemetry', isSecondaryDependency: true, type: 'async' }
];

export const AGENT_PIPELINE: AgentPipelineStep[] = [
  { id: 'sup', name: 'SUPERVISOR', role: 'Ingestion & Orchestration', status: 'completed', detail: 'Ingested change ticket CR-8842 from Terraform pipeline' },
  { id: 'dep', name: 'DEPENDENCY', role: 'Recursive Graph Miner', status: 'completed', detail: 'Discovered 7 direct & 11 indirect service links' },
  { id: 'topo', name: 'TOPOLOGY', role: 'Network & VPC Mapper', status: 'completed', detail: 'Mapped live routing tree in ap-south-1' },
  { id: 'sec', name: 'SECURITY', role: 'IAM & Perimeter Auditor', status: 'alert', detail: 'Live production ENI interfaces bound to subnet-07' },
  { id: 'imp', name: 'IMPACT', role: 'Telemetry Simulator', status: 'alert', detail: 'Revenue-critical Payment API outage projected (2.4M req/hr)' },
  { id: 'pol', name: 'POLICY', role: 'Governance Authority', status: 'alert', detail: 'Cedar policy violation: PRODUCTION_CHANGE_REQUIRES_APPROVAL' },
  { id: 'dec', name: 'DECISION', role: 'Safety Gate Enforcer', status: 'alert', detail: 'Enforced BLOCK CHANGE safety barrier' }
];

export interface DashboardChangeRequest {
  id: string;
  title: string;
  action: string;
  target: string;
  resourceName: string;
  resourceType: string;
  serviceCategory: string; // VPC, EC2, ECS, RDS, Lambda, S3, IAM
  environment: 'Production' | 'Staging' | 'Dev';
  region: string;
  timeAgo: string;
  status: 'Blocked' | 'Approved' | 'Pending';
  statusColor: 'red' | 'green' | 'amber' | 'gray';
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  affectedResources: number;
  criticalServices: number;
  externalDependencies: number;
  decisionTitle: string;
  decisionMessage: string;
  actionIcon: 'trash' | 'shield' | 'server' | 'database' | 'cpu' | 'key' | 'layers';
}

export const DASHBOARD_CHANGE_REQUESTS: DashboardChangeRequest[] = [
  {
    id: 'cr-01',
    title: 'Delete subnet-07',
    action: 'Delete',
    target: 'subnet-07',
    resourceName: 'subnet-07',
    resourceType: 'Subnet',
    serviceCategory: 'VPC',
    environment: 'Production',
    region: 'ap-south-1',
    timeAgo: '2m ago',
    status: 'Blocked',
    statusColor: 'red',
    riskScore: 87,
    riskLevel: 'Critical',
    affectedResources: 11,
    criticalServices: 3,
    externalDependencies: 2,
    decisionTitle: 'Change Blocked',
    decisionMessage: 'This change may impact critical production services.',
    actionIcon: 'trash'
  },
  {
    id: 'cr-02',
    title: 'Update security group',
    action: 'Update',
    target: 'sg-prod-ingress',
    resourceName: 'sg-prod-ingress',
    resourceType: 'Security Group',
    serviceCategory: 'EC2',
    environment: 'Production',
    region: 'ap-south-1',
    timeAgo: '8m ago',
    status: 'Approved',
    statusColor: 'green',
    riskScore: 24,
    riskLevel: 'Low',
    affectedResources: 2,
    criticalServices: 0,
    externalDependencies: 1,
    decisionTitle: 'Change Approved',
    decisionMessage: 'All security checks and blast radius validation passed.',
    actionIcon: 'shield'
  },
  {
    id: 'cr-03',
    title: 'Scale ECS service',
    action: 'Scale',
    target: 'ecs-api-cluster',
    resourceName: 'ecs-api-cluster',
    resourceType: 'ECS Service',
    serviceCategory: 'ECS',
    environment: 'Staging',
    region: 'ap-south-1',
    timeAgo: '12m ago',
    status: 'Pending',
    statusColor: 'amber',
    riskScore: 58,
    riskLevel: 'Medium',
    affectedResources: 6,
    criticalServices: 1,
    externalDependencies: 2,
    decisionTitle: 'Review Pending',
    decisionMessage: 'Awaiting secondary sign-off on autoscaling thresholds.',
    actionIcon: 'server'
  },
  {
    id: 'cr-04',
    title: 'Modify RDS instance',
    action: 'Modify',
    target: 'aurora-pg-cluster',
    resourceName: 'aurora-pg-cluster',
    resourceType: 'RDS Cluster',
    serviceCategory: 'RDS',
    environment: 'Production',
    region: 'ap-south-1',
    timeAgo: '20m ago',
    status: 'Approved',
    statusColor: 'green',
    riskScore: 15,
    riskLevel: 'Low',
    affectedResources: 1,
    criticalServices: 0,
    externalDependencies: 0,
    decisionTitle: 'Change Approved',
    decisionMessage: 'Non-disruptive parameter group change verified.',
    actionIcon: 'database'
  },
  {
    id: 'cr-05',
    title: 'Deploy new Lambda',
    action: 'Deploy',
    target: 'fn-webhook-ingest',
    resourceName: 'fn-webhook-ingest',
    resourceType: 'Lambda Function',
    serviceCategory: 'Lambda',
    environment: 'Dev',
    region: 'ap-south-1',
    timeAgo: '36m ago',
    status: 'Pending',
    statusColor: 'gray',
    riskScore: 10,
    riskLevel: 'Low',
    affectedResources: 0,
    criticalServices: 0,
    externalDependencies: 0,
    decisionTitle: 'Review Pending',
    decisionMessage: 'Automated CI/CD smoke test pipeline currently running.',
    actionIcon: 'cpu'
  },
  {
    id: 'cr-06',
    title: 'Delete S3 bucket',
    action: 'Delete',
    target: 'prod-backup-archive-2026',
    resourceName: 'prod-backup-archive-2026',
    resourceType: 'S3 Bucket',
    serviceCategory: 'S3',
    environment: 'Production',
    region: 'ap-south-1',
    timeAgo: '1h ago',
    status: 'Blocked',
    statusColor: 'red',
    riskScore: 92,
    riskLevel: 'Critical',
    affectedResources: 14,
    criticalServices: 4,
    externalDependencies: 3,
    decisionTitle: 'Change Blocked',
    decisionMessage: 'Bucket holds active disaster recovery replicas and retention locks.',
    actionIcon: 'trash'
  },
  {
    id: 'cr-07',
    title: 'Update IAM policy',
    action: 'Update',
    target: 'iam-role-payment-worker',
    resourceName: 'iam-role-payment-worker',
    resourceType: 'IAM Policy',
    serviceCategory: 'IAM',
    environment: 'Production',
    region: 'ap-south-1',
    timeAgo: '2h ago',
    status: 'Approved',
    statusColor: 'green',
    riskScore: 19,
    riskLevel: 'Low',
    affectedResources: 3,
    criticalServices: 0,
    externalDependencies: 1,
    decisionTitle: 'Change Approved',
    decisionMessage: 'Principle of least privilege compliant with zero policy violations.',
    actionIcon: 'key'
  },
  {
    id: 'cr-08',
    title: 'Create new VPC',
    action: 'Create',
    target: 'vpc-analytics-sandbox',
    resourceName: 'vpc-analytics-sandbox',
    resourceType: 'VPC',
    serviceCategory: 'VPC',
    environment: 'Dev',
    region: 'ap-south-1',
    timeAgo: '3h ago',
    status: 'Pending',
    statusColor: 'gray',
    riskScore: 5,
    riskLevel: 'Low',
    affectedResources: 0,
    criticalServices: 0,
    externalDependencies: 0,
    decisionTitle: 'Review Pending',
    decisionMessage: 'Isolated network sandbox awaiting subnet allocation.',
    actionIcon: 'layers'
  }
];

export const CHANGE_REQUESTS_LIST: ChangeRequestItem[] = [
  {
    id: 'cr-8842',
    ticketId: 'CR-8842',
    action: 'DELETE',
    target: 'subnet-07',
    resourceType: 'AWS::EC2::Subnet',
    environment: 'PRODUCTION',
    region: 'ap-south-1',
    vpc: 'vpc-0a884f932e',
    cidr: '10.0.4.0/24',
    requestedBy: 'alex.k (Cloud Platform)',
    requestedTime: '12 minutes ago',
    status: 'BLOCKED',
    riskScore: 87,
    riskLevel: 'CRITICAL',
    directImpactCount: 7,
    indirectImpactCount: 11,
    trafficAtRisk: '2.4M req/hr',
    policyResult: 'VIOLATION',
    reason: 'Deleting subnet-07 would sever ENIs for Payment API and trigger cascade failure in Aurora PG database.'
  },
  {
    id: 'cr-8843',
    ticketId: 'CR-8843',
    action: 'MODIFY',
    target: 'sg-prod-ingress',
    resourceType: 'AWS::EC2::SecurityGroup',
    environment: 'PRODUCTION',
    region: 'ap-south-1',
    vpc: 'vpc-0a884f932e',
    requestedBy: 'priya.m (DevOps)',
    requestedTime: '34 minutes ago',
    status: 'BLOCKED',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    directImpactCount: 14,
    indirectImpactCount: 22,
    trafficAtRisk: '4.8M req/hr',
    policyResult: 'VIOLATION',
    reason: 'Proposed rule opens port 5432 to 0.0.0.0/0, violating perimeter ingress isolation policy.'
  },
  {
    id: 'cr-8844',
    ticketId: 'CR-8844',
    action: 'TERMINATE',
    target: 'i-09f4b1e84a8c',
    resourceType: 'AWS::EC2::Instance',
    environment: 'PRODUCTION',
    region: 'us-east-1',
    vpc: 'vpc-01182cf91a',
    requestedBy: 'automation-bot',
    requestedTime: '1 hour ago',
    status: 'APPROVED',
    riskScore: 18,
    riskLevel: 'LOW',
    directImpactCount: 0,
    indirectImpactCount: 1,
    trafficAtRisk: '0 req/hr',
    policyResult: 'COMPLIANT',
    reason: 'Canary worker instance successfully drained; auto-scaling group capacity rebalanced.'
  },
  {
    id: 'cr-8845',
    ticketId: 'CR-8845',
    action: 'ROTATE',
    target: 'kms-prod-key-master',
    resourceType: 'AWS::KMS::Key',
    environment: 'PRODUCTION',
    region: 'ap-south-1',
    vpc: 'vpc-0a884f932e',
    requestedBy: 'security-team',
    requestedTime: '2 hours ago',
    status: 'PENDING_APPROVAL',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    directImpactCount: 8,
    indirectImpactCount: 19,
    trafficAtRisk: '3.1M req/hr',
    policyResult: 'NEEDS_REVIEW',
    reason: 'Automatic rotation scheduled; requires secondary principal sign-off before key alias repointing.'
  }
];

export const STATS = {
  changeRequest: {
    action: 'DELETE',
    target: 'subnet-07',
    environment: 'PRODUCTION',
    requestedBy: 'alex.k (Cloud Platform)',
    status: 'BLOCKED',
    region: 'ap-south-1',
    vpc: 'vpc-0a884f932e',
    cidr: '10.0.4.0/24'
  },
  dependencyDiscovery: {
    direct: 7,
    indirect: 11,
    productionDatabases: 3,
    criticalPaymentAPI: 1
  },
  riskScore: 87,
  riskLevel: 'CRITICAL',
  riskFactors: [
    'Dependency Impact (7 direct, 11 indirect)',
    'Criticality (Revenue-Critical Payment API)',
    'Network ENI Severance',
    'Cedar Governance Policy Violation',
    'Live Production Environment'
  ],
  governance: {
    title: 'POLICY CHECK',
    changeDetection: 'Production infrastructure change detected.',
    requiredApproval: 'Senior Engineer',
    policyName: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL',
    result: 'VIOLATION'
  },
  decision: {
    action: 'CHANGE BLOCKED',
    buttonText: 'BLOCK CHANGE',
    risk: 'CRITICAL',
    blastRadius: 'HIGH',
    score: '87 / 100',
    reason: 'Deleting subnet-07 would affect critical production services and violates production change policy.'
  },
  brand: {
    name: 'BLASTGUARD',
    subtitle: 'Infrastructure Blast-Radius Intelligence',
    tagline: 'Before you change production, know what will break.'
  }
};
