import {
  EC2Client,
  DescribeVpcsCommand,
  DescribeSubnetsCommand,
  DescribeInstancesCommand,
  DescribeSecurityGroupsCommand,
} from '@aws-sdk/client-ec2';
import {
  ECSClient,
  ListClustersCommand,
  ListServicesCommand,
  DescribeServicesCommand,
} from '@aws-sdk/client-ecs';
import {
  RDSClient,
  DescribeDBInstancesCommand,
} from '@aws-sdk/client-rds';
import {
  LambdaClient,
  ListFunctionsCommand,
  GetFunctionCommand,
} from '@aws-sdk/client-lambda';
import {
  S3Client,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import {
  IAMClient,
  ListRolesCommand,
  GetRoleCommand,
} from '@aws-sdk/client-iam';
import {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand,
} from '@aws-sdk/client-elastic-load-balancing-v2';

import { Criticality, Environment, Resource, ResourceType } from '../models/Resource';
import { Dependency } from '../models/Dependency';
import { ImpactGraph } from '../models/ImpactGraph';
import { TopologyEdge } from '../models/TopologyEdge';
import { TopologyNode } from '../models/TopologyNode';
import { handleAWSError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ResourceFilter, ResourceProvider } from './ResourceProvider';

export interface AWSProviderClients {
  ec2Client?: EC2Client;
  ecsClient?: ECSClient;
  rdsClient?: RDSClient;
  lambdaClient?: LambdaClient;
  s3Client?: S3Client;
  iamClient?: IAMClient;
  elbv2Client?: ElasticLoadBalancingV2Client;
}

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

/**
 * AWSResourceProvider
 *
 * Implements read-only discovery of live AWS infrastructure resources using AWS SDK v3.
 *
 * STRICT SAFETY RULE:
 * BlastGuard is a pre-change safety gate, NEVER an execution engine.
 * This provider implements ONLY read-only discovery APIs (Describe*, List*, Get*).
 * Under NO circumstances are mutating operations (Delete*, Terminate*, Create*, Modify*) permitted.
 */
export class AWSResourceProvider implements ResourceProvider {
  private region: string;
  private ttlMs: number;

  private ec2Client: EC2Client;
  private ecsClient: ECSClient;
  private rdsClient: RDSClient;
  private lambdaClient: LambdaClient;
  private s3Client: S3Client;
  private iamClient: IAMClient;
  private elbv2Client: ElasticLoadBalancingV2Client;

  // In-memory per-analysis caches to minimize AWS API requests and prevent rate-limiting
  private resourceCache = new Map<string, CacheEntry<Resource | null>>();
  private dependencyCache = new Map<string, CacheEntry<Dependency[]>>();
  private inventoryCache: CacheEntry<Resource[]> | null = null;
  private allDependenciesCache: CacheEntry<Dependency[]> | null = null;

  constructor(
    region: string = 'ap-south-1',
    clients?: AWSProviderClients,
    ttlMs: number = 60000
  ) {
    this.region = region;
    this.ttlMs = ttlMs;

    this.ec2Client = clients?.ec2Client || new EC2Client({ region: this.region });
    this.ecsClient = clients?.ecsClient || new ECSClient({ region: this.region });
    this.rdsClient = clients?.rdsClient || new RDSClient({ region: this.region });
    this.lambdaClient = clients?.lambdaClient || new LambdaClient({ region: this.region });
    this.s3Client = clients?.s3Client || new S3Client({ region: this.region });
    this.iamClient = clients?.iamClient || new IAMClient({ region: this.region });
    this.elbv2Client = clients?.elbv2Client || new ElasticLoadBalancingV2Client({ region: this.region });
  }

  /**
   * Clears in-memory caches (useful for testing and fresh analysis passes)
   */
  clearCache(): void {
    this.resourceCache.clear();
    this.dependencyCache.clear();
    this.inventoryCache = null;
    this.allDependenciesCache = null;
  }

  /**
   * Retrieve a single resource by its identifier
   */
  async getResource(resourceId: string): Promise<Resource | null> {
    const cached = this.resourceCache.get(resourceId);
    if (cached && Date.now() - cached.cachedAt < this.ttlMs) {
      return cached.data;
    }

    logger.debug(`[AWSResourceProvider] Live discovery for resource: ${resourceId} in region ${this.region}`);

    try {
      let resource: Resource | null = null;

      if (resourceId.startsWith('vpc-')) {
        resource = await this.fetchVpc(resourceId);
      } else if (resourceId.startsWith('subnet-')) {
        resource = await this.fetchSubnet(resourceId);
      } else if (resourceId.startsWith('i-')) {
        resource = await this.fetchEC2Instance(resourceId);
      } else if (resourceId.startsWith('sg-')) {
        resource = await this.fetchSecurityGroup(resourceId);
      } else {
        // Look up by querying inventory or service-specific endpoints
        resource = await this.findGenericResource(resourceId);
      }

      this.resourceCache.set(resourceId, { data: resource, cachedAt: Date.now() });
      return resource;
    } catch (error) {
      const parsed = handleAWSError(error, resourceId);

      // If not found in AWS, return null cleanly without throwing
      if (parsed.statusCode === 404) {
        this.resourceCache.set(resourceId, { data: null, cachedAt: Date.now() });
        return null;
      }

      // If credentials or permission error, throw structured AWSError
      logger.error(`[AWSResourceProvider] Error fetching resource '${resourceId}': ${parsed.message}`);
      throw parsed;
    }
  }

  /**
   * List all discovered resources across supported services
   */
  async listResources(filter?: ResourceFilter): Promise<Resource[]> {
    if (this.inventoryCache && Date.now() - this.inventoryCache.cachedAt < this.ttlMs) {
      return this.filterResources(this.inventoryCache.data, filter);
    }

    logger.info(`[AWSResourceProvider] Discovering multi-service AWS infrastructure in ${this.region}`);

    const results = await Promise.allSettled([
      this.listVpcs(),
      this.listSubnets(),
      this.listEC2Instances(),
      this.listSecurityGroups(),
      this.listRdsInstances(),
      this.listLambdaFunctions(),
      this.listEcsServices(),
      this.listS3Buckets(),
      this.listIamRoles(),
      this.listLoadBalancers(),
    ]);

    const allDiscovered: Resource[] = [];
    let failureCount = 0;
    let credentialsError = false;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allDiscovered.push(...result.value);
      } else {
        failureCount++;
        const parsed = handleAWSError(result.reason);
        if (parsed.code === 'AWS_CREDENTIALS_UNAVAILABLE') {
          credentialsError = true;
        }
        logger.warn(`[AWSResourceProvider] Partial service discovery failed: ${parsed.message}`);
      }
    }

    if (credentialsError && allDiscovered.length === 0) {
      throw handleAWSError(new Error('CredentialsProviderError'));
    }

    // Cache discovered resources
    allDiscovered.forEach((r) => {
      this.resourceCache.set(r.id, { data: r, cachedAt: Date.now() });
    });

    this.inventoryCache = { data: allDiscovered, cachedAt: Date.now() };

    return this.filterResources(allDiscovered, filter);
  }

  /**
   * Retrieve direct and immediate dependencies for a given resource
   */
  async getDependencies(resourceId: string): Promise<Dependency[]> {
    const cached = this.dependencyCache.get(resourceId);
    if (cached && Date.now() - cached.cachedAt < this.ttlMs) {
      return cached.data;
    }

    // Ensure inventory is populated
    const inventory = await this.listResources();
    const allDeps = await this.buildDependencyGraph(inventory);

    // Filter dependencies connected to the requested resource
    const connectedDeps = allDeps.filter(
      (dep) =>
        dep.source === resourceId ||
        dep.target === resourceId ||
        dep.sourceResourceId === resourceId ||
        dep.targetResourceId === resourceId
    );

    this.dependencyCache.set(resourceId, { data: connectedDeps, cachedAt: Date.now() });
    return connectedDeps;
  }

  /**
   * Retrieve complete topology representation as an ImpactGraph
   */
  async getTopology(): Promise<ImpactGraph> {
    const inventory = await this.listResources();
    const allDeps = await this.buildDependencyGraph(inventory);

    const nodes: TopologyNode[] = inventory.map((r) => ({
      id: r.id,
      name: r.name,
      label: r.name,
      type: r.type,
      criticality: r.criticality,
      environment: r.environment,
      region: r.region,
      isExternal: r.isExternal,
      data: { arn: r.arn, tags: r.tags, ...r.metadata },
    }));

    const edges: TopologyEdge[] = allDeps.map((d, index) => ({
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
      rootResourceId: inventory[0]?.id || 'aws-root',
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

  // ==========================================
  // Private AWS Service Fetchers (Read-Only)
  // ==========================================

  private async fetchVpc(vpcId: string): Promise<Resource | null> {
    const res = await this.ec2Client.send(new DescribeVpcsCommand({ VpcIds: [vpcId] }));
    const vpc = res.Vpcs?.[0];
    if (!vpc || !vpc.VpcId) return null;

    const tags = this.convertTags(vpc.Tags);
    const name = tags['Name'] || vpc.VpcId;
    const environment = this.inferEnvironment(name, tags);
    const criticality = this.inferCriticality(name, tags, 'VPC', environment);

    return {
      id: vpc.VpcId,
      name,
      type: 'VPC',
      region: this.region,
      environment,
      criticality,
      arn: `arn:aws:ec2:${this.region}:::vpc/${vpc.VpcId}`,
      tags,
      metadata: { cidrBlock: vpc.CidrBlock },
    };
  }

  private async fetchSubnet(subnetId: string): Promise<Resource | null> {
    const res = await this.ec2Client.send(new DescribeSubnetsCommand({ SubnetIds: [subnetId] }));
    const subnet = res.Subnets?.[0];
    if (!subnet || !subnet.SubnetId) return null;

    const tags = this.convertTags(subnet.Tags);
    const name = tags['Name'] || subnet.SubnetId;
    const environment = this.inferEnvironment(name, tags);
    const criticality = this.inferCriticality(name, tags, 'Subnet', environment);

    return {
      id: subnet.SubnetId,
      name,
      type: 'Subnet',
      region: this.region,
      environment,
      criticality,
      arn: subnet.SubnetArn || `arn:aws:ec2:${this.region}:::subnet/${subnet.SubnetId}`,
      tags,
      metadata: {
        vpcId: subnet.VpcId,
        cidrBlock: subnet.CidrBlock,
        availabilityZone: subnet.AvailabilityZone,
      },
    };
  }

  private async fetchEC2Instance(instanceId: string): Promise<Resource | null> {
    const res = await this.ec2Client.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
    const instance = res.Reservations?.[0]?.Instances?.[0];
    if (!instance || !instance.InstanceId) return null;

    const tags = this.convertTags(instance.Tags);
    const name = tags['Name'] || instance.InstanceId;
    const environment = this.inferEnvironment(name, tags);
    const criticality = this.inferCriticality(name, tags, 'EC2', environment);

    return {
      id: instance.InstanceId,
      name,
      type: 'EC2',
      region: this.region,
      environment,
      criticality,
      arn: `arn:aws:ec2:${this.region}:::instance/${instance.InstanceId}`,
      tags,
      metadata: {
        vpcId: instance.VpcId,
        subnetId: instance.SubnetId,
        instanceType: instance.InstanceType,
        securityGroupIds: instance.SecurityGroups?.map((sg) => sg.GroupId).filter(Boolean),
        iamInstanceProfile: instance.IamInstanceProfile?.Arn,
      },
    };
  }

  private async fetchSecurityGroup(groupId: string): Promise<Resource | null> {
    const res = await this.ec2Client.send(new DescribeSecurityGroupsCommand({ GroupIds: [groupId] }));
    const sg = res.SecurityGroups?.[0];
    if (!sg || !sg.GroupId) return null;

    const tags = this.convertTags(sg.Tags);
    const name = sg.GroupName || sg.GroupId;
    const environment = this.inferEnvironment(name, tags);
    const criticality = this.inferCriticality(name, tags, 'SecurityGroup', environment);

    return {
      id: sg.GroupId,
      name,
      type: 'SecurityGroup',
      region: this.region,
      environment,
      criticality,
      arn: `arn:aws:ec2:${this.region}:::security-group/${sg.GroupId}`,
      tags,
      metadata: {
        vpcId: sg.VpcId,
        description: sg.Description,
      },
    };
  }

  private async findGenericResource(resourceId: string): Promise<Resource | null> {
    // 1. Check RDS
    try {
      const rdsRes = await this.rdsClient.send(
        new DescribeDBInstancesCommand({ DBInstanceIdentifier: resourceId })
      );
      const db = rdsRes.DBInstances?.[0];
      if (db && db.DBInstanceIdentifier) {
        const environment = this.inferEnvironment(db.DBInstanceIdentifier, {});
        const criticality = this.inferCriticality(db.DBInstanceIdentifier, {}, 'RDS', environment);
        return {
          id: db.DBInstanceIdentifier,
          name: db.DBInstanceIdentifier,
          type: 'RDS',
          region: this.region,
          environment,
          criticality,
          arn: db.DBInstanceArn,
          metadata: {
            engine: db.Engine,
            vpcId: db.DBSubnetGroup?.VpcId,
            subnetIds: db.DBSubnetGroup?.Subnets?.map((s) => s.SubnetIdentifier).filter(Boolean),
            securityGroupIds: db.VpcSecurityGroups?.map((sg) => sg.VpcSecurityGroupId).filter(Boolean),
          },
        };
      }
    } catch {
      // Continue search
    }

    // 2. Check Lambda
    try {
      const lambdaRes = await this.lambdaClient.send(
        new GetFunctionCommand({ FunctionName: resourceId })
      );
      const fn = lambdaRes.Configuration;
      if (fn && fn.FunctionName) {
        const tags = lambdaRes.Tags || {};
        const environment = this.inferEnvironment(fn.FunctionName, tags);
        const criticality = this.inferCriticality(fn.FunctionName, tags, 'Lambda', environment);
        return {
          id: fn.FunctionName,
          name: fn.FunctionName,
          type: 'Lambda',
          region: this.region,
          environment,
          criticality,
          arn: fn.FunctionArn,
          tags,
          metadata: {
            runtime: fn.Runtime,
            role: fn.Role,
            subnetIds: fn.VpcConfig?.SubnetIds,
            securityGroupIds: fn.VpcConfig?.SecurityGroupIds,
          },
        };
      }
    } catch {
      // Continue search
    }

    // 3. Check IAM Role
    try {
      const iamRes = await this.iamClient.send(new GetRoleCommand({ RoleName: resourceId }));
      const role = iamRes.Role;
      if (role && role.RoleName) {
        const tags = this.convertTags(role.Tags);
        const environment = this.inferEnvironment(role.RoleName, tags);
        const criticality = this.inferCriticality(role.RoleName, tags, 'IAM', environment);
        return {
          id: role.RoleName,
          name: role.RoleName,
          type: 'IAM',
          region: this.region,
          environment,
          criticality,
          arn: role.Arn,
          tags,
          metadata: { description: role.Description },
        };
      }
    } catch {
      // Continue search
    }

    // 4. Check Load Balancers
    try {
      const elbRes = await this.elbv2Client.send(
        new DescribeLoadBalancersCommand({ Names: [resourceId] })
      );
      const lb = elbRes.LoadBalancers?.[0];
      if (lb && lb.LoadBalancerName) {
        const environment = this.inferEnvironment(lb.LoadBalancerName, {});
        const criticality = this.inferCriticality(lb.LoadBalancerName, {}, 'LoadBalancer', environment);
        return {
          id: lb.LoadBalancerName,
          name: lb.LoadBalancerName,
          type: 'LoadBalancer',
          region: this.region,
          environment,
          criticality,
          arn: lb.LoadBalancerArn,
          isExternal: lb.Scheme === 'internet-facing',
          metadata: {
            scheme: lb.Scheme,
            vpcId: lb.VpcId,
            subnetIds: lb.AvailabilityZones?.map((az) => az.SubnetId).filter(Boolean),
            securityGroupIds: lb.SecurityGroups,
          },
        };
      }
    } catch {
      // Not found
    }

    return null;
  }

  // ==========================================
  // Private Bulk List Methods (Read-Only)
  // ==========================================

  private async listVpcs(): Promise<Resource[]> {
    const res = await this.ec2Client.send(new DescribeVpcsCommand({}));
    return (res.Vpcs || []).map((vpc) => {
      const tags = this.convertTags(vpc.Tags);
      const name = tags['Name'] || vpc.VpcId || 'vpc';
      const environment = this.inferEnvironment(name, tags);
      const criticality = this.inferCriticality(name, tags, 'VPC', environment);

      return {
        id: vpc.VpcId || '',
        name,
        type: 'VPC' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: `arn:aws:ec2:${this.region}:::vpc/${vpc.VpcId}`,
        tags,
        metadata: { cidrBlock: vpc.CidrBlock },
      };
    });
  }

  private async listSubnets(): Promise<Resource[]> {
    const res = await this.ec2Client.send(new DescribeSubnetsCommand({}));
    return (res.Subnets || []).map((subnet) => {
      const tags = this.convertTags(subnet.Tags);
      const name = tags['Name'] || subnet.SubnetId || 'subnet';
      const environment = this.inferEnvironment(name, tags);
      const criticality = this.inferCriticality(name, tags, 'Subnet', environment);

      return {
        id: subnet.SubnetId || '',
        name,
        type: 'Subnet' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: subnet.SubnetArn,
        tags,
        metadata: {
          vpcId: subnet.VpcId,
          cidrBlock: subnet.CidrBlock,
          availabilityZone: subnet.AvailabilityZone,
        },
      };
    });
  }

  private async listEC2Instances(): Promise<Resource[]> {
    const res = await this.ec2Client.send(new DescribeInstancesCommand({}));
    const instances: Resource[] = [];

    for (const reservation of res.Reservations || []) {
      for (const inst of reservation.Instances || []) {
        const tags = this.convertTags(inst.Tags);
        const name = tags['Name'] || inst.InstanceId || 'instance';
        const environment = this.inferEnvironment(name, tags);
        const criticality = this.inferCriticality(name, tags, 'EC2', environment);

        instances.push({
          id: inst.InstanceId || '',
          name,
          type: 'EC2' as ResourceType,
          region: this.region,
          environment,
          criticality,
          arn: `arn:aws:ec2:${this.region}:::instance/${inst.InstanceId}`,
          tags,
          metadata: {
            vpcId: inst.VpcId,
            subnetId: inst.SubnetId,
            instanceType: inst.InstanceType,
            securityGroupIds: inst.SecurityGroups?.map((sg) => sg.GroupId).filter(Boolean),
            iamInstanceProfile: inst.IamInstanceProfile?.Arn,
          },
        });
      }
    }

    return instances;
  }

  private async listSecurityGroups(): Promise<Resource[]> {
    const res = await this.ec2Client.send(new DescribeSecurityGroupsCommand({}));
    return (res.SecurityGroups || []).map((sg) => {
      const tags = this.convertTags(sg.Tags);
      const name = sg.GroupName || sg.GroupId || 'security-group';
      const environment = this.inferEnvironment(name, tags);
      const criticality = this.inferCriticality(name, tags, 'SecurityGroup', environment);

      return {
        id: sg.GroupId || '',
        name,
        type: 'SecurityGroup' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: `arn:aws:ec2:${this.region}:::security-group/${sg.GroupId}`,
        tags,
        metadata: {
          vpcId: sg.VpcId,
          description: sg.Description,
        },
      };
    });
  }

  private async listRdsInstances(): Promise<Resource[]> {
    const res = await this.rdsClient.send(new DescribeDBInstancesCommand({}));
    return (res.DBInstances || []).map((db) => {
      const name = db.DBInstanceIdentifier || 'rds-instance';
      const environment = this.inferEnvironment(name, {});
      const criticality = this.inferCriticality(name, {}, 'RDS', environment);

      return {
        id: db.DBInstanceIdentifier || '',
        name,
        type: 'RDS' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: db.DBInstanceArn,
        metadata: {
          engine: db.Engine,
          vpcId: db.DBSubnetGroup?.VpcId,
          subnetIds: db.DBSubnetGroup?.Subnets?.map((s) => s.SubnetIdentifier).filter(Boolean),
          securityGroupIds: db.VpcSecurityGroups?.map((sg) => sg.VpcSecurityGroupId).filter(Boolean),
        },
      };
    });
  }

  private async listLambdaFunctions(): Promise<Resource[]> {
    const res = await this.lambdaClient.send(new ListFunctionsCommand({}));
    return (res.Functions || []).map((fn) => {
      const name = fn.FunctionName || 'lambda-function';
      const environment = this.inferEnvironment(name, {});
      const criticality = this.inferCriticality(name, {}, 'Lambda', environment);

      return {
        id: fn.FunctionName || '',
        name,
        type: 'Lambda' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: fn.FunctionArn,
        metadata: {
          runtime: fn.Runtime,
          role: fn.Role,
          subnetIds: fn.VpcConfig?.SubnetIds,
          securityGroupIds: fn.VpcConfig?.SecurityGroupIds,
        },
      };
    });
  }

  private async listEcsServices(): Promise<Resource[]> {
    const clustersRes = await this.ecsClient.send(new ListClustersCommand({}));
    const clusterArns = clustersRes.clusterArns || [];
    const services: Resource[] = [];

    for (const clusterArn of clusterArns) {
      const listSvcRes = await this.ecsClient.send(new ListServicesCommand({ cluster: clusterArn }));
      const serviceArns = listSvcRes.serviceArns || [];
      if (serviceArns.length === 0) continue;

      const descSvcRes = await this.ecsClient.send(
        new DescribeServicesCommand({ cluster: clusterArn, services: serviceArns })
      );

      for (const svc of descSvcRes.services || []) {
        const name = svc.serviceName || 'ecs-service';
        const environment = this.inferEnvironment(name, {});
        const criticality = this.inferCriticality(name, {}, 'ECS', environment);

        const subnets = svc.networkConfiguration?.awsvpcConfiguration?.subnets || [];
        const securityGroups = svc.networkConfiguration?.awsvpcConfiguration?.securityGroups || [];

        services.push({
          id: svc.serviceName || svc.serviceArn || '',
          name,
          type: 'ECS' as ResourceType,
          region: this.region,
          environment,
          criticality,
          arn: svc.serviceArn,
          metadata: {
            clusterArn,
            taskDefinition: svc.taskDefinition,
            subnetIds: subnets,
            securityGroupIds: securityGroups,
            roleArn: svc.roleArn,
          },
        });
      }
    }

    return services;
  }

  private async listS3Buckets(): Promise<Resource[]> {
    const res = await this.s3Client.send(new ListBucketsCommand({}));
    return (res.Buckets || []).map((b) => {
      const name = b.Name || 's3-bucket';
      const environment = this.inferEnvironment(name, {});
      const criticality = this.inferCriticality(name, {}, 'S3', environment);

      return {
        id: b.Name || '',
        name,
        type: 'S3' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: `arn:aws:s3:::${b.Name}`,
      };
    });
  }

  private async listIamRoles(): Promise<Resource[]> {
    const res = await this.iamClient.send(new ListRolesCommand({ MaxItems: 100 }));
    return (res.Roles || []).map((r) => {
      const tags = this.convertTags(r.Tags);
      const name = r.RoleName || 'iam-role';
      const environment = this.inferEnvironment(name, tags);
      const criticality = this.inferCriticality(name, tags, 'IAM', environment);

      return {
        id: r.RoleName || '',
        name,
        type: 'IAM' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: r.Arn,
        tags,
        metadata: { description: r.Description },
      };
    });
  }

  private async listLoadBalancers(): Promise<Resource[]> {
    const res = await this.elbv2Client.send(new DescribeLoadBalancersCommand({}));
    return (res.LoadBalancers || []).map((lb) => {
      const name = lb.LoadBalancerName || 'load-balancer';
      const environment = this.inferEnvironment(name, {});
      const criticality = this.inferCriticality(name, {}, 'LoadBalancer', environment);
      const isExternal = lb.Scheme === 'internet-facing';

      return {
        id: lb.LoadBalancerName || '',
        name,
        type: 'LoadBalancer' as ResourceType,
        region: this.region,
        environment,
        criticality,
        arn: lb.LoadBalancerArn,
        isExternal,
        metadata: {
          scheme: lb.Scheme,
          vpcId: lb.VpcId,
          subnetIds: lb.AvailabilityZones?.map((az) => az.SubnetId).filter(Boolean),
          securityGroupIds: lb.SecurityGroups,
        },
      };
    });
  }

  // ==========================================
  // Dependency Graph Construction
  // ==========================================

  private async buildDependencyGraph(resources: Resource[]): Promise<Dependency[]> {
    if (this.allDependenciesCache && Date.now() - this.allDependenciesCache.cachedAt < this.ttlMs) {
      return this.allDependenciesCache.data;
    }

    const dependencies: Dependency[] = [];
    const resourceMap = new Map<string, Resource>(resources.map((r) => [r.id, r]));

    for (const res of resources) {
      const meta = res.metadata || {};

      // 1. Subnet <-> VPC
      if (res.type === 'Subnet' && meta.vpcId && typeof meta.vpcId === 'string') {
        dependencies.push({
          source: meta.vpcId,
          target: res.id,
          sourceResourceId: meta.vpcId,
          targetResourceId: res.id,
          relationship: 'HOSTS',
          criticality: 'HIGH',
          description: `VPC ${meta.vpcId} hosts subnet ${res.id}`,
        });
      }

      // 2. Workload <-> Subnet (EC2, RDS, ECS, Lambda, LoadBalancer)
      const subnetIds: string[] = [];
      if (meta.subnetId && typeof meta.subnetId === 'string') {
        subnetIds.push(meta.subnetId);
      }
      if (Array.isArray(meta.subnetIds)) {
        subnetIds.push(...meta.subnetIds.filter((s) => typeof s === 'string'));
      }

      for (const subnetId of subnetIds) {
        if (resourceMap.has(subnetId)) {
          // Subnet HOSTS workload
          dependencies.push({
            source: subnetId,
            target: res.id,
            sourceResourceId: subnetId,
            targetResourceId: res.id,
            relationship: 'HOSTS',
            criticality: res.criticality,
            description: `Subnet ${subnetId} hosts ${res.type} ${res.id}`,
          });

          // Workload DEPENDS_ON subnet
          dependencies.push({
            source: res.id,
            target: subnetId,
            sourceResourceId: res.id,
            targetResourceId: subnetId,
            relationship: 'DEPENDS_ON',
            criticality: res.criticality,
            description: `${res.type} ${res.id} depends on subnet ${subnetId}`,
          });
        }
      }

      // 3. Workload <-> SecurityGroup
      const sgIds: string[] = [];
      if (Array.isArray(meta.securityGroupIds)) {
        sgIds.push(...meta.securityGroupIds.filter((sg) => typeof sg === 'string'));
      }

      for (const sgId of sgIds) {
        if (resourceMap.has(sgId)) {
          dependencies.push({
            source: res.id,
            target: sgId,
            sourceResourceId: res.id,
            targetResourceId: sgId,
            relationship: 'PROTECTED_BY',
            criticality: 'HIGH',
            description: `${res.type} ${res.id} protected by security group ${sgId}`,
          });
        }
      }

      // 4. Workload <-> IAM Role
      const roleRef = meta.role || meta.roleArn || meta.iamInstanceProfile;
      if (roleRef && typeof roleRef === 'string') {
        // Find matching IAM resource by ARN or name
        const roleRes = resources.find(
          (r) => r.type === 'IAM' && (r.arn === roleRef || r.name === roleRef || roleRef.endsWith(r.name))
        );
        if (roleRes) {
          dependencies.push({
            source: res.id,
            target: roleRes.id,
            sourceResourceId: res.id,
            targetResourceId: roleRes.id,
            relationship: 'USES',
            criticality: 'HIGH',
            description: `${res.type} ${res.id} uses IAM role ${roleRes.id}`,
          });
        }
      }
    }

    this.allDependenciesCache = { data: dependencies, cachedAt: Date.now() };
    return dependencies;
  }

  // ==========================================
  // Normalization Helpers
  // ==========================================

  private filterResources(resources: Resource[], filter?: ResourceFilter): Resource[] {
    if (!filter) return resources;

    return resources.filter((r) => {
      if (filter.type && r.type !== filter.type) return false;
      if (filter.region && r.region !== filter.region) return false;
      if (filter.environment && r.environment !== filter.environment) return false;
      if (filter.criticality && r.criticality !== filter.criticality) return false;
      return true;
    });
  }

  private convertTags(tags?: Array<{ Key?: string; Value?: string }>): Record<string, string> {
    const result: Record<string, string> = {};
    if (!tags || !Array.isArray(tags)) return result;

    for (const tag of tags) {
      if (tag.Key && tag.Value !== undefined) {
        result[tag.Key] = tag.Value;
      }
    }
    return result;
  }

  private inferEnvironment(name: string, tags: Record<string, string>): Environment {
    const envTag = (tags['Environment'] || tags['env'] || tags['stage'] || '').toLowerCase();
    const lowerName = name.toLowerCase();

    if (envTag.includes('prod') || lowerName.includes('prod')) {
      return 'PRODUCTION';
    }
    if (envTag.includes('stag') || lowerName.includes('stag')) {
      return 'STAGING';
    }
    return 'DEV';
  }

  private inferCriticality(
    name: string,
    tags: Record<string, string>,
    type: ResourceType,
    environment: Environment
  ): Criticality {
    const critTag = (tags['Criticality'] || tags['priority'] || tags['tier'] || '').toLowerCase();
    const lowerName = name.toLowerCase();

    if (critTag.includes('crit') || lowerName.includes('payment') || lowerName.includes('auth')) {
      return 'CRITICAL';
    }

    if (environment === 'PRODUCTION') {
      if (type === 'VPC' || type === 'Subnet' || type === 'RDS' || type === 'LoadBalancer') {
        return 'CRITICAL';
      }
      return 'HIGH';
    }

    if (environment === 'STAGING') {
      return 'MEDIUM';
    }

    return 'LOW';
  }
}
