export type ResourceType =
  | 'VPC'
  | 'Subnet'
  | 'EC2'
  | 'ECS'
  | 'RDS'
  | 'Lambda'
  | 'S3'
  | 'IAM'
  | 'LoadBalancer'
  | 'SecurityGroup';

export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Environment = 'DEV' | 'STAGING' | 'PRODUCTION';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  region: string;
  environment: Environment;
  criticality: Criticality;
  arn?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export const VALID_RESOURCE_TYPES: ResourceType[] = [
  'VPC',
  'Subnet',
  'EC2',
  'ECS',
  'RDS',
  'Lambda',
  'S3',
  'IAM',
  'LoadBalancer',
  'SecurityGroup',
];

export const VALID_ENVIRONMENTS: Environment[] = ['DEV', 'STAGING', 'PRODUCTION'];

export const VALID_CRITICALITIES: Criticality[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
