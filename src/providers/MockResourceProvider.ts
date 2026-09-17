import { Dependency } from '../models/Dependency';
import { ImpactGraph } from '../models/ImpactGraph';
import { Resource } from '../models/Resource';
import { TopologyEdge } from '../models/TopologyEdge';
import { TopologyNode } from '../models/TopologyNode';
import { ResourceFilter, ResourceProvider } from './ResourceProvider';

export class MockResourceProvider implements ResourceProvider {
  private resources: Resource[] = [
    {
      id: 'vpc-prod-main',
      name: 'production-primary-vpc',
      type: 'VPC',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:vpc/vpc-prod-main',
      tags: { Environment: 'production', Project: 'Core' },
      metadata: { cidrBlock: '10.0.0.0/16' },
    },
    {
      id: 'subnet-prod-public-1a',
      name: 'public-subnet-1a',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-prod-public-1a',
      tags: { Environment: 'production', Tier: 'public' },
      metadata: { vpcId: 'vpc-prod-main', cidrBlock: '10.0.1.0/24' },
    },
    {
      id: 'subnet-07',
      name: 'private-app-subnet-07',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-07',
      tags: { Environment: 'production', Tier: 'private-app' },
      metadata: { vpcId: 'vpc-prod-main', cidrBlock: '10.0.7.0/24' },
    },
    {
      id: 'subnet-prod-private-1b',
      name: 'private-db-subnet-1b',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-prod-private-1b',
      tags: { Environment: 'production', Tier: 'private-db' },
      metadata: { vpcId: 'vpc-prod-main', cidrBlock: '10.0.8.0/24' },
    },
    {
      id: 'sg-prod-alb',
      name: 'alb-security-group',
      type: 'SecurityGroup',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:security-group/sg-prod-alb',
      tags: { Environment: 'production', Role: 'loadbalancer' },
    },
    {
      id: 'sg-prod-backend',
      name: 'backend-app-security-group',
      type: 'SecurityGroup',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:security-group/sg-prod-backend',
      tags: { Environment: 'production', Role: 'application' },
    },
    {
      id: 'alb-prod-external',
      name: 'external-production-alb',
      type: 'LoadBalancer',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/alb-prod-external',
      tags: { Environment: 'production' },
    },
    {
      id: 'ec2-order-processor',
      name: 'order-processing-instance',
      type: 'EC2',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:ec2:ap-south-1:123456789012:instance/ec2-order-processor',
      tags: { Environment: 'production', Service: 'orders' },
    },
    {
      id: 'ecs-checkout-service',
      name: 'checkout-microservice',
      type: 'ECS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:ecs:ap-south-1:123456789012:service/ecs-checkout-service',
      tags: { Environment: 'production', Service: 'checkout' },
    },
    {
      id: 'rds-main-postgres',
      name: 'primary-orders-postgres',
      type: 'RDS',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:rds:ap-south-1:123456789012:db:rds-main-postgres',
      tags: { Environment: 'production', Engine: 'postgres' },
    },
    {
      id: 'lambda-payment-authorizer',
      name: 'payment-authorizer-webhook',
      type: 'Lambda',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:lambda:ap-south-1:123456789012:function:lambda-payment-authorizer',
      tags: { Environment: 'production' },
    },
    {
      id: 's3-customer-documents',
      name: 'customer-vault-prod-documents',
      type: 'S3',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'HIGH',
      arn: 'arn:aws:s3:::customer-vault-prod-documents',
      tags: { Environment: 'production' },
    },
    {
      id: 'iam-role-backend-execution',
      name: 'backend-instance-execution-role',
      type: 'IAM',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      criticality: 'CRITICAL',
      arn: 'arn:aws:iam::123456789012:role/backend-instance-execution-role',
      tags: { Environment: 'production' },
    },
  ];

  private dependencies: Dependency[] = [
    {
      sourceResourceId: 'subnet-prod-public-1a',
      targetResourceId: 'vpc-prod-main',
      relationship: 'CONTAINS',
      description: 'Public Subnet is inside VPC',
    },
    {
      sourceResourceId: 'subnet-07',
      targetResourceId: 'vpc-prod-main',
      relationship: 'CONTAINS',
      description: 'Subnet 07 is contained inside VPC',
    },
    {
      sourceResourceId: 'subnet-prod-private-1b',
      targetResourceId: 'vpc-prod-main',
      relationship: 'CONTAINS',
      description: 'Private DB Subnet is inside VPC',
    },
    {
      sourceResourceId: 'alb-prod-external',
      targetResourceId: 'subnet-prod-public-1a',
      relationship: 'DEPENDS_ON',
      description: 'Load Balancer attached to public subnet',
    },
    {
      sourceResourceId: 'alb-prod-external',
      targetResourceId: 'sg-prod-alb',
      relationship: 'SECURED_BY',
      description: 'Load Balancer protected by ALB security group',
    },
    {
      sourceResourceId: 'ec2-order-processor',
      targetResourceId: 'subnet-07',
      relationship: 'DEPENDS_ON',
      description: 'EC2 instance resides within subnet-07',
    },
    {
      sourceResourceId: 'ec2-order-processor',
      targetResourceId: 'sg-prod-backend',
      relationship: 'SECURED_BY',
      description: 'EC2 instance assigned backend security group',
    },
    {
      sourceResourceId: 'ec2-order-processor',
      targetResourceId: 'iam-role-backend-execution',
      relationship: 'ATTACHED_TO',
      description: 'EC2 instance assumes execution IAM role',
    },
    {
      sourceResourceId: 'alb-prod-external',
      targetResourceId: 'ec2-order-processor',
      relationship: 'ROUTES_TO',
      description: 'ALB routes ingress HTTP traffic to EC2 order processor',
    },
    {
      sourceResourceId: 'rds-main-postgres',
      targetResourceId: 'subnet-07',
      relationship: 'DEPENDS_ON',
      description: 'RDS Database primary subnet member subnet-07',
    },
    {
      sourceResourceId: 'rds-main-postgres',
      targetResourceId: 'subnet-prod-private-1b',
      relationship: 'DEPENDS_ON',
      description: 'RDS Database secondary subnet member subnet-prod-private-1b',
    },
    {
      sourceResourceId: 'ec2-order-processor',
      targetResourceId: 'rds-main-postgres',
      relationship: 'CONNECTS_TO',
      description: 'EC2 order processor reads and writes to RDS primary',
    },
    {
      sourceResourceId: 'ecs-checkout-service',
      targetResourceId: 'subnet-prod-private-1b',
      relationship: 'DEPENDS_ON',
      description: 'ECS tasks run in subnet-prod-private-1b',
    },
    {
      sourceResourceId: 'ecs-checkout-service',
      targetResourceId: 'rds-main-postgres',
      relationship: 'CONNECTS_TO',
      description: 'ECS checkout service connects to RDS primary database',
    },
    {
      sourceResourceId: 'lambda-payment-authorizer',
      targetResourceId: 'rds-main-postgres',
      relationship: 'CONNECTS_TO',
      description: 'Lambda payment webhook queries RDS ledger',
    },
    {
      sourceResourceId: 'lambda-payment-authorizer',
      targetResourceId: 's3-customer-documents',
      relationship: 'CONNECTS_TO',
      description: 'Lambda payment authorizer stores payment tokens in S3',
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
      (dep) => dep.sourceResourceId === resourceId || dep.targetResourceId === resourceId
    );
  }

  async getTopology(): Promise<ImpactGraph> {
    const nodes: TopologyNode[] = this.resources.map((r) => ({
      id: r.id,
      label: r.name,
      type: r.type,
      criticality: r.criticality,
      environment: r.environment,
      region: r.region,
      data: { arn: r.arn, tags: r.tags },
    }));

    const edges: TopologyEdge[] = this.dependencies.map((d, index) => ({
      id: `edge-${index + 1}`,
      source: d.sourceResourceId,
      target: d.targetResourceId,
      relationship: d.relationship,
      label: d.description,
    }));

    return {
      rootResourceId: 'vpc-prod-main',
      nodes,
      edges,
      blastRadiusCount: nodes.length,
      directImpactCount: edges.length,
      indirectImpactCount: 0,
      depth: 3,
    };
  }
}
