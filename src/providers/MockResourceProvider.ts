import { Dependency } from '../models/Dependency';
import { ImpactGraph } from '../models/ImpactGraph';
import { Resource } from '../models/Resource';
import { TopologyEdge } from '../models/TopologyEdge';
import { TopologyNode } from '../models/TopologyNode';
import { ResourceFilter, ResourceProvider } from './ResourceProvider';

export class MockResourceProvider implements ResourceProvider {
  /**
   * Deterministic mock AWS environment consisting of 20 realistic AWS resources.
   * Includes VPC, Subnets, EC2, ECS, RDS, Lambda, S3, Load Balancer, Security Groups,
   * IAM roles, and External Integrations.
   */
  private resources: Resource[] = [
    // 1. VPC
    {
      id: 'vpc-prod',
      name: 'vpc-prod',
      type: 'VPC',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:vpc/vpc-prod',
      tags: { Environment: 'production', Project: 'Core' },
      metadata: { cidrBlock: '10.0.0.0/16' },
    },
    // 2. Critical Demo Resource: subnet-07
    {
      id: 'subnet-07',
      name: 'subnet-07',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-07',
      tags: { Environment: 'production', Tier: 'private-app', Workload: 'payments' },
      metadata: { vpcId: 'vpc-prod', cidrBlock: '10.0.7.0/24' },
    },
    // 3. Secondary Private Subnet: subnet-08
    {
      id: 'subnet-08',
      name: 'subnet-08',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-08',
      tags: { Environment: 'production', Tier: 'private-db', Workload: 'orders' },
      metadata: { vpcId: 'vpc-prod', cidrBlock: '10.0.8.0/24' },
    },
    // 4. Public Subnet
    {
      id: 'subnet-public',
      name: 'subnet-public',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-public',
      tags: { Environment: 'production', Tier: 'public' },
      metadata: { vpcId: 'vpc-prod', cidrBlock: '10.0.1.0/24' },
    },
    // 5. Ingress Internet-facing Load Balancer (External Dependency #1)
    {
      id: 'production-load-balancer',
      name: 'production-load-balancer',
      type: 'LoadBalancer',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      isExternal: true,
      arn: 'arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/production-load-balancer',
      tags: { Environment: 'production', Tier: 'ingress', PublicFacing: 'true' },
    },
    // 6. Security Group for Payments
    {
      id: 'payment-security-group',
      name: 'payment-security-group',
      type: 'SecurityGroup',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:security-group/payment-security-group',
      tags: { Environment: 'production', App: 'payments' },
    },
    // 7. Payment API (Critical Service #1)
    {
      id: 'payment-api',
      name: 'payment-api',
      type: 'ECS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ecs:ap-south-1:123456789012:service/payment-api',
      tags: { Environment: 'production', App: 'payments', Tier: 'api' },
    },
    // 8. Payment Worker (Critical Service #2)
    {
      id: 'payment-worker',
      name: 'payment-worker',
      type: 'EC2',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:instance/payment-worker',
      tags: { Environment: 'production', App: 'payments', Tier: 'worker' },
    },
    // 9. Payment Database
    {
      id: 'payment-db',
      name: 'payment-db',
      type: 'RDS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:rds:ap-south-1:123456789012:db:payment-db',
      tags: { Environment: 'production', Engine: 'postgres', App: 'payments' },
    },
    // 10. Payment Notifier (Critical Service #3)
    {
      id: 'payment-notifier',
      name: 'payment-notifier',
      type: 'Lambda',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:lambda:ap-south-1:123456789012:function:payment-notifier',
      tags: { Environment: 'production', App: 'payments', Tier: 'notifications' },
    },
    // 11. Payment Data Bucket
    {
      id: 'payment-data-bucket',
      name: 'payment-data-bucket',
      type: 'S3',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:s3:::payment-data-bucket',
      tags: { Environment: 'production', App: 'payments' },
    },
    // 12. IAM Role for Payments
    {
      id: 'iam-payment-role',
      name: 'iam-payment-role',
      type: 'IAM',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:iam::123456789012:role/iam-payment-role',
      tags: { Environment: 'production', App: 'payments' },
    },
    // 13. External Payment Settlement Gateway (External Dependency #2)
    {
      id: 'external-payment-gateway',
      name: 'external-payment-gateway',
      type: 'External',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      isExternal: true,
      arn: 'arn:aws:custom:::external-api/payment-gateway',
      tags: { Environment: 'production', Provider: 'banking-partner', PublicFacing: 'true' },
    },
    // 14. Order Service (Upstream Consumer Service)
    {
      id: 'order-service',
      name: 'order-service',
      type: 'ECS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ecs:ap-south-1:123456789012:service/order-service',
      tags: { Environment: 'production', App: 'orders' },
    },
    // 15. Order Database (Hosted in subnet-08)
    {
      id: 'order-db',
      name: 'order-db',
      type: 'RDS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:rds:ap-south-1:123456789012:db:order-db',
      tags: { Environment: 'production', App: 'orders' },
    },
    // 16. Security Group for Orders
    {
      id: 'order-security-group',
      name: 'order-security-group',
      type: 'SecurityGroup',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'MEDIUM',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:security-group/order-security-group',
      tags: { Environment: 'production', App: 'orders' },
    },
    // 17. S3 Bucket for Orders
    {
      id: 'order-data-bucket',
      name: 'order-data-bucket',
      type: 'S3',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'MEDIUM',
      arn: 'arn:aws:s3:::order-data-bucket',
      tags: { Environment: 'production', App: 'orders' },
    },
    // 18. IAM Role for Orders
    {
      id: 'iam-order-role',
      name: 'iam-order-role',
      type: 'IAM',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:iam::123456789012:role/iam-order-role',
      tags: { Environment: 'production', App: 'orders' },
    },
    // 19. Standalone Notification Service
    {
      id: 'notification-service',
      name: 'notification-service',
      type: 'Lambda',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'MEDIUM',
      arn: 'arn:aws:lambda:ap-south-1:123456789012:function:notification-service',
      tags: { Environment: 'production', App: 'notifications' },
    },
    // 20. Ingress ALB Security Group
    {
      id: 'alb-security-group',
      name: 'alb-security-group',
      type: 'SecurityGroup',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:security-group/alb-security-group',
      tags: { Environment: 'production', Role: 'ingress' },
    },
  ];

  /**
   * Deterministic AWS dependency graph with rich relationships:
   * HOSTS, DEPENDS_ON, CONNECTS_TO, USES, ROUTES_TO, PROTECTED_BY, STORES_IN, CALLS.
   */
  private dependencies: Dependency[] = [
    // --- Subnet 07 Hosting & Direct Dependencies ---
    {
      source: 'subnet-07',
      target: 'payment-api',
      sourceResourceId: 'subnet-07',
      targetResourceId: 'payment-api',
      relationship: 'HOSTS',
      direct: true,
      criticality: 'CRITICAL',
      description: 'subnet-07 hosts payment-api containers',
    },
    {
      source: 'subnet-07',
      target: 'payment-worker',
      sourceResourceId: 'subnet-07',
      targetResourceId: 'payment-worker',
      relationship: 'HOSTS',
      direct: true,
      criticality: 'CRITICAL',
      description: 'subnet-07 hosts payment-worker EC2 instances',
    },
    {
      source: 'payment-api',
      target: 'subnet-07',
      sourceResourceId: 'payment-api',
      targetResourceId: 'subnet-07',
      relationship: 'DEPENDS_ON',
      direct: true,
      criticality: 'CRITICAL',
      description: 'payment-api network interfaces bound to subnet-07',
    },
    {
      source: 'payment-worker',
      target: 'subnet-07',
      sourceResourceId: 'payment-worker',
      targetResourceId: 'subnet-07',
      relationship: 'DEPENDS_ON',
      direct: true,
      criticality: 'CRITICAL',
      description: 'payment-worker instance ENI attached to subnet-07',
    },

    // --- Payment API Dependencies & Relationships ---
    {
      source: 'production-load-balancer',
      target: 'payment-api',
      sourceResourceId: 'production-load-balancer',
      targetResourceId: 'payment-api',
      relationship: 'ROUTES_TO',
      direct: true,
      criticality: 'HIGH',
      description: 'Production Load Balancer forwards external HTTPS traffic to payment-api',
    },
    {
      source: 'order-service',
      target: 'payment-api',
      sourceResourceId: 'order-service',
      targetResourceId: 'payment-api',
      relationship: 'CALLS',
      direct: true,
      criticality: 'HIGH',
      description: 'order-service calls payment-api for checkout payment authorization',
    },
    {
      source: 'payment-api',
      target: 'payment-db',
      sourceResourceId: 'payment-api',
      targetResourceId: 'payment-db',
      relationship: 'CONNECTS_TO',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-api reads and writes ledger records to payment-db',
    },
    {
      source: 'payment-api',
      target: 'payment-security-group',
      sourceResourceId: 'payment-api',
      targetResourceId: 'payment-security-group',
      relationship: 'PROTECTED_BY',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-api secured by payment-security-group ingress/egress rules',
    },
    {
      source: 'payment-api',
      target: 'iam-payment-role',
      sourceResourceId: 'payment-api',
      targetResourceId: 'iam-payment-role',
      relationship: 'USES',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-api assumes iam-payment-role for AWS API authorization',
    },
    {
      source: 'payment-api',
      target: 'payment-notifier',
      sourceResourceId: 'payment-api',
      targetResourceId: 'payment-notifier',
      relationship: 'CALLS',
      direct: true,
      criticality: 'CRITICAL',
      description: 'payment-api invokes payment-notifier Lambda on payment status updates',
    },
    {
      source: 'payment-api',
      target: 'external-payment-gateway',
      sourceResourceId: 'payment-api',
      targetResourceId: 'external-payment-gateway',
      relationship: 'CALLS',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-api calls external-payment-gateway partner endpoint for settlement',
    },
    {
      source: 'payment-api',
      target: 'payment-data-bucket',
      sourceResourceId: 'payment-api',
      targetResourceId: 'payment-data-bucket',
      relationship: 'STORES_IN',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-api stores receipts and settlement payloads in payment-data-bucket',
    },

    // --- Payment Worker Dependencies ---
    {
      source: 'payment-worker',
      target: 'payment-security-group',
      sourceResourceId: 'payment-worker',
      targetResourceId: 'payment-security-group',
      relationship: 'PROTECTED_BY',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-worker protected by payment-security-group',
    },
    {
      source: 'payment-worker',
      target: 'iam-payment-role',
      sourceResourceId: 'payment-worker',
      targetResourceId: 'iam-payment-role',
      relationship: 'USES',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-worker assumes iam-payment-role',
    },
    {
      source: 'payment-worker',
      target: 'payment-db',
      sourceResourceId: 'payment-worker',
      targetResourceId: 'payment-db',
      relationship: 'CONNECTS_TO',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-worker polls and reconciles transactions in payment-db',
    },
    {
      source: 'payment-worker',
      target: 'payment-data-bucket',
      sourceResourceId: 'payment-worker',
      targetResourceId: 'payment-data-bucket',
      relationship: 'STORES_IN',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-worker archives batch reconciliation reports in payment-data-bucket',
    },

    // --- Payment Notifier Dependencies & Graph Cycle ---
    {
      source: 'payment-notifier',
      target: 'payment-api',
      sourceResourceId: 'payment-notifier',
      targetResourceId: 'payment-api',
      relationship: 'CALLS',
      direct: false,
      criticality: 'HIGH',
      description: 'payment-notifier queries payment-api status (circular cycle validation)',
    },
    {
      source: 'payment-notifier',
      target: 'payment-data-bucket',
      sourceResourceId: 'payment-notifier',
      targetResourceId: 'payment-data-bucket',
      relationship: 'STORES_IN',
      direct: true,
      criticality: 'HIGH',
      description: 'payment-notifier writes audit dispatch logs to payment-data-bucket',
    },

    // --- Isolated VPC, Subnet 08 & Order Subsystem Dependencies ---
    {
      source: 'vpc-prod',
      target: 'subnet-07',
      sourceResourceId: 'vpc-prod',
      targetResourceId: 'subnet-07',
      relationship: 'HOSTS',
      direct: false,
      criticality: 'HIGH',
      description: 'vpc-prod network contains subnet-07',
    },
    {
      source: 'vpc-prod',
      target: 'subnet-08',
      sourceResourceId: 'vpc-prod',
      targetResourceId: 'subnet-08',
      relationship: 'HOSTS',
      direct: false,
      criticality: 'HIGH',
      description: 'vpc-prod network contains subnet-08',
    },
    {
      source: 'vpc-prod',
      target: 'subnet-public',
      sourceResourceId: 'vpc-prod',
      targetResourceId: 'subnet-public',
      relationship: 'HOSTS',
      direct: false,
      criticality: 'HIGH',
      description: 'vpc-prod network contains subnet-public',
    },
    {
      source: 'subnet-public',
      target: 'production-load-balancer',
      sourceResourceId: 'subnet-public',
      targetResourceId: 'production-load-balancer',
      relationship: 'HOSTS',
      direct: true,
      criticality: 'HIGH',
      description: 'subnet-public provides public IPs for production-load-balancer',
    },
    {
      source: 'production-load-balancer',
      target: 'alb-security-group',
      sourceResourceId: 'production-load-balancer',
      targetResourceId: 'alb-security-group',
      relationship: 'PROTECTED_BY',
      direct: true,
      criticality: 'HIGH',
      description: 'production-load-balancer bound to alb-security-group',
    },
    {
      source: 'subnet-08',
      target: 'order-db',
      sourceResourceId: 'subnet-08',
      targetResourceId: 'order-db',
      relationship: 'HOSTS',
      direct: true,
      criticality: 'HIGH',
      description: 'subnet-08 hosts order-db',
    },
    {
      source: 'order-service',
      target: 'order-db',
      sourceResourceId: 'order-service',
      targetResourceId: 'order-db',
      relationship: 'CONNECTS_TO',
      direct: true,
      criticality: 'HIGH',
      description: 'order-service reads and writes order records to order-db',
    },
    {
      source: 'order-service',
      target: 'order-security-group',
      sourceResourceId: 'order-service',
      targetResourceId: 'order-security-group',
      relationship: 'PROTECTED_BY',
      direct: true,
      criticality: 'MEDIUM',
      description: 'order-service protected by order-security-group',
    },
    {
      source: 'order-service',
      target: 'iam-order-role',
      sourceResourceId: 'order-service',
      targetResourceId: 'iam-order-role',
      relationship: 'USES',
      direct: true,
      criticality: 'HIGH',
      description: 'order-service assumes iam-order-role',
    },
    {
      source: 'order-service',
      target: 'order-data-bucket',
      sourceResourceId: 'order-service',
      targetResourceId: 'order-data-bucket',
      relationship: 'STORES_IN',
      direct: true,
      criticality: 'MEDIUM',
      description: 'order-service saves purchase orders in order-data-bucket',
    },
    {
      source: 'notification-service',
      target: 'iam-order-role',
      sourceResourceId: 'notification-service',
      targetResourceId: 'iam-order-role',
      relationship: 'USES',
      direct: true,
      criticality: 'HIGH',
      description: 'notification-service uses execution role',
    },
    {
      source: 'notification-service',
      target: 'order-data-bucket',
      sourceResourceId: 'notification-service',
      targetResourceId: 'order-data-bucket',
      relationship: 'STORES_IN',
      direct: true,
      criticality: 'MEDIUM',
      description: 'notification-service reads notification templates from order-data-bucket',
    },
  ];

  async getResource(resourceId: string): Promise<Resource | null> {
    const resource = this.resources.find((r) => r.id === resourceId);
    return resource ? { ...resource } : null;
  }

  async listResources(filter?: ResourceFilter): Promise<Resource[]> {
    let result = [...this.resources];
    if (!filter) return result;

    if (filter.type) {
      result = result.filter((r) => r.type === filter.type);
    }
    if (filter.region) {
      result = result.filter((r) => r.region === filter.region);
    }
    if (filter.environment) {
      result = result.filter((r) => r.environment === filter.environment);
    }
    if (filter.criticality) {
      result = result.filter((r) => r.criticality === filter.criticality);
    }
    return result;
  }

  async getDependencies(resourceId: string): Promise<Dependency[]> {
    return this.dependencies.filter(
      (dep) =>
        dep.source === resourceId ||
        dep.target === resourceId ||
        dep.sourceResourceId === resourceId ||
        dep.targetResourceId === resourceId
    );
  }

  async getAllDependencies(): Promise<Dependency[]> {
    return [...this.dependencies];
  }

  async getTopology(): Promise<ImpactGraph> {
    const nodes: TopologyNode[] = this.resources.map((r) => ({
      id: r.id,
      name: r.name,
      label: r.name,
      type: r.type,
      criticality: r.criticality,
      environment: r.environment,
      region: r.region,
      isExternal: r.isExternal,
      data: { arn: r.arn, tags: r.tags },
    }));

    const edges: TopologyEdge[] = this.dependencies.map((d, index) => ({
      id: `edge-${index + 1}`,
      source: d.source || d.sourceResourceId || '',
      target: d.target || d.targetResourceId || '',
      relationship: d.relationship,
      label: d.description,
    }));

    const criticalNodes = nodes.filter(
      (n) =>
        n.criticality === 'CRITICAL' &&
        (n.type === 'EC2' || n.type === 'ECS' || n.type === 'Lambda')
    );
    const externalNodes = nodes.filter((n) => n.isExternal === true);

    return {
      rootResourceId: 'vpc-prod',
      nodes,
      edges,
      affectedNodes: nodes,
      criticalNodes,
      externalNodes,
      blastRadiusCount: nodes.length,
      directImpactCount: edges.length,
      indirectImpactCount: 0,
      depth: 3,
      criticalServicesCount: criticalNodes.length,
      externalDependenciesCount: externalNodes.length,
    };
  }
}
