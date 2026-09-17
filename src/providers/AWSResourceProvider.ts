import { EC2Client, DescribeInstancesCommand, DescribeVpcsCommand, DescribeSubnetsCommand } from '@aws-sdk/client-ec2';
import { Dependency } from '../models/Dependency';
import { ImpactGraph } from '../models/ImpactGraph';
import { Resource } from '../models/Resource';
import { logger } from '../utils/logger';
import { ResourceFilter, ResourceProvider } from './ResourceProvider';

export class AWSResourceProvider implements ResourceProvider {
  private ec2Client: EC2Client;
  private region: string;

  constructor(region: string = 'ap-south-1') {
    this.region = region;
    this.ec2Client = new EC2Client({ region: this.region });
  }

  async getResource(resourceId: string): Promise<Resource | null> {
    logger.info(`AWSResourceProvider: Fetching resource ${resourceId} in region ${this.region}`);
    // Live AWS SDK lookup skeleton:
    // In Stage 1, live discovery is scaffolded behind this provider abstraction.
    try {
      if (resourceId.startsWith('vpc-')) {
        const res = await this.ec2Client.send(new DescribeVpcsCommand({ VpcIds: [resourceId] }));
        const vpc = res.Vpcs?.[0];
        if (vpc && vpc.VpcId) {
          return {
            id: vpc.VpcId,
            name: vpc.Tags?.find((t) => t.Key === 'Name')?.Value || vpc.VpcId,
            type: 'VPC',
            region: this.region,
            environment: 'PRODUCTION',
            criticality: 'HIGH',
            arn: `arn:aws:ec2:${this.region}:::vpc/${vpc.VpcId}`,
          };
        }
      }

      if (resourceId.startsWith('subnet-')) {
        const res = await this.ec2Client.send(
          new DescribeSubnetsCommand({ SubnetIds: [resourceId] })
        );
        const subnet = res.Subnets?.[0];
        if (subnet && subnet.SubnetId) {
          return {
            id: subnet.SubnetId,
            name: subnet.Tags?.find((t) => t.Key === 'Name')?.Value || subnet.SubnetId,
            type: 'Subnet',
            region: this.region,
            environment: 'PRODUCTION',
            criticality: 'HIGH',
            arn: subnet.SubnetArn,
          };
        }
      }

      if (resourceId.startsWith('i-')) {
        const res = await this.ec2Client.send(
          new DescribeInstancesCommand({ InstanceIds: [resourceId] })
        );
        const instance = res.Reservations?.[0]?.Instances?.[0];
        if (instance && instance.InstanceId) {
          return {
            id: instance.InstanceId,
            name: instance.Tags?.find((t) => t.Key === 'Name')?.Value || instance.InstanceId,
            type: 'EC2',
            region: this.region,
            environment: 'PRODUCTION',
            criticality: 'HIGH',
            arn: `arn:aws:ec2:${this.region}:::instance/${instance.InstanceId}`,
          };
        }
      }

      return null;
    } catch (error) {
      logger.warn(
        `AWSResourceProvider: Failed live AWS lookup for ${resourceId}, falling back to null`,
        { error }
      );
      return null;
    }
  }

  async listResources(_filter?: ResourceFilter): Promise<Resource[]> {
    logger.info('AWSResourceProvider: Listing resources via AWS SDK');
    // Scaffolded for Stage 1; full live multi-service inventory engine to be expanded in Stage 2
    return [];
  }

  async getDependencies(_resourceId: string): Promise<Dependency[]> {
    logger.info('AWSResourceProvider: Resolving live AWS dependencies');
    return [];
  }

  async getTopology(): Promise<ImpactGraph> {
    logger.info('AWSResourceProvider: Building live AWS topology graph');
    return {
      rootResourceId: 'aws-account-root',
      nodes: [],
      edges: [],
      affectedNodes: [],
      criticalNodes: [],
      externalNodes: [],
      blastRadiusCount: 0,
      directImpactCount: 0,
      indirectImpactCount: 0,
    };
  }
}
