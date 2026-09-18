import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  AWSResourceProvider,
  AWSProviderClients,
  getResourceProvider,
  setResourceProvider,
  resetResourceProvider,
  MockResourceProvider,
  ResourceProvider,
} from '../src/providers';
import { handleAWSError, AWSError } from '../src/utils/errors';
import { supervisorAgent } from '../src/agents/SupervisorAgent';
import { ChangeRequest } from '../src/models/ChangeRequest';
import { AppConfig } from '../src/config';

describe('Stage 5: AWSResourceProvider, Mode Switching & Hardening', () => {
  beforeEach(() => {
    resetResourceProvider();
  });

  afterEach(() => {
    resetResourceProvider();
    vi.restoreAllMocks();
  });

  describe('1. Mode Switching & Boundary Isolation', () => {
    it('returns MockResourceProvider when mode is mock', () => {
      const mockConfig: AppConfig = {
        port: 3000,
        awsRegion: 'ap-south-1',
        mode: 'mock',
        frontendUrl: 'http://localhost:5173',
        nodeEnv: 'test',
      };

      const provider = getResourceProvider(mockConfig);
      expect(provider).toBeInstanceOf(MockResourceProvider);
    });

    it('returns AWSResourceProvider when mode is aws', () => {
      const awsConfig: AppConfig = {
        port: 3000,
        awsRegion: 'ap-south-1',
        mode: 'aws',
        frontendUrl: 'http://localhost:5173',
        nodeEnv: 'test',
      };

      const provider = getResourceProvider(awsConfig);
      expect(provider).toBeInstanceOf(AWSResourceProvider);
    });

    it('allows dynamic mode switching at the factory boundary without service impact', () => {
      const mockConfig: AppConfig = {
        port: 3000,
        awsRegion: 'ap-south-1',
        mode: 'mock',
        frontendUrl: 'http://localhost:5173',
        nodeEnv: 'test',
      };
      const awsConfig: AppConfig = {
        ...mockConfig,
        mode: 'aws',
      };

      const p1 = getResourceProvider(mockConfig);
      expect(p1).toBeInstanceOf(MockResourceProvider);

      const p2 = getResourceProvider(awsConfig);
      expect(p2).toBeInstanceOf(AWSResourceProvider);
    });

    it('allows explicit provider injection via setResourceProvider', () => {
      const customMock = new MockResourceProvider();
      setResourceProvider(customMock);

      const provider = getResourceProvider();
      expect(provider).toBe(customMock);
    });
  });

  describe('2. AWSResourceProvider Discovery & Normalization (Mocked AWS SDK)', () => {
    let mockClients: AWSProviderClients;
    let ec2Send: ReturnType<typeof vi.fn>;
    let rdsSend: ReturnType<typeof vi.fn>;
    let lambdaSend: ReturnType<typeof vi.fn>;
    let ecsSend: ReturnType<typeof vi.fn>;
    let s3Send: ReturnType<typeof vi.fn>;
    let iamSend: ReturnType<typeof vi.fn>;
    let elbv2Send: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      ec2Send = vi.fn();
      rdsSend = vi.fn();
      lambdaSend = vi.fn();
      ecsSend = vi.fn();
      s3Send = vi.fn();
      iamSend = vi.fn();
      elbv2Send = vi.fn();

      mockClients = {
        ec2Client: { send: ec2Send } as any,
        rdsClient: { send: rdsSend } as any,
        lambdaClient: { send: lambdaSend } as any,
        ecsClient: { send: ecsSend } as any,
        s3Client: { send: s3Send } as any,
        iamClient: { send: iamSend } as any,
        elbv2Client: { send: elbv2Send } as any,
      };
    });

    it('discovers and normalizes an AWS VPC resource', async () => {
      ec2Send.mockResolvedValueOnce({
        Vpcs: [
          {
            VpcId: 'vpc-live-01',
            CidrBlock: '10.0.0.0/16',
            Tags: [
              { Key: 'Name', Value: 'production-vpc' },
              { Key: 'Environment', Value: 'production' },
            ],
          },
        ],
      });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const vpc = await provider.getResource('vpc-live-01');

      expect(vpc).not.toBeNull();
      expect(vpc?.id).toBe('vpc-live-01');
      expect(vpc?.name).toBe('production-vpc');
      expect(vpc?.type).toBe('VPC');
      expect(vpc?.environment).toBe('PRODUCTION');
      expect(vpc?.criticality).toBe('CRITICAL');
      expect(vpc?.metadata?.cidrBlock).toBe('10.0.0.0/16');
      expect(ec2Send).toHaveBeenCalledTimes(1);
    });

    it('discovers and normalizes an AWS Subnet resource', async () => {
      ec2Send.mockResolvedValueOnce({
        Subnets: [
          {
            SubnetId: 'subnet-live-07',
            SubnetArn: 'arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-live-07',
            VpcId: 'vpc-live-01',
            CidrBlock: '10.0.7.0/24',
            AvailabilityZone: 'ap-south-1a',
            Tags: [
              { Key: 'Name', Value: 'subnet-live-07' },
              { Key: 'Environment', Value: 'production' },
              { Key: 'Workload', Value: 'payments' },
            ],
          },
        ],
      });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const subnet = await provider.getResource('subnet-live-07');

      expect(subnet).not.toBeNull();
      expect(subnet?.id).toBe('subnet-live-07');
      expect(subnet?.type).toBe('Subnet');
      expect(subnet?.environment).toBe('PRODUCTION');
      expect(subnet?.criticality).toBe('CRITICAL');
      expect(subnet?.metadata?.vpcId).toBe('vpc-live-01');
    });

    it('discovers and normalizes an EC2 instance', async () => {
      ec2Send.mockResolvedValueOnce({
        Reservations: [
          {
            Instances: [
              {
                InstanceId: 'i-0123456789abcdef0',
                InstanceType: 'c6i.large',
                SubnetId: 'subnet-live-07',
                VpcId: 'vpc-live-01',
                SecurityGroups: [{ GroupId: 'sg-live-payment' }],
                Tags: [{ Key: 'Name', Value: 'live-payment-worker' }],
              },
            ],
          },
        ],
      });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const ec2 = await provider.getResource('i-0123456789abcdef0');

      expect(ec2).not.toBeNull();
      expect(ec2?.id).toBe('i-0123456789abcdef0');
      expect(ec2?.type).toBe('EC2');
      expect(ec2?.metadata?.subnetId).toBe('subnet-live-07');
    });

    it('discovers and normalizes a Security Group', async () => {
      ec2Send.mockResolvedValueOnce({
        SecurityGroups: [
          {
            GroupId: 'sg-live-payment',
            GroupName: 'payment-sec-group',
            Description: 'Payment service firewall',
            VpcId: 'vpc-live-01',
            Tags: [{ Key: 'Environment', Value: 'production' }],
          },
        ],
      });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const sg = await provider.getResource('sg-live-payment');

      expect(sg).not.toBeNull();
      expect(sg?.id).toBe('sg-live-payment');
      expect(sg?.name).toBe('payment-sec-group');
      expect(sg?.type).toBe('SecurityGroup');
      expect(sg?.metadata?.vpcId).toBe('vpc-live-01');
    });

    it('discovers and normalizes generic resources (RDS, Lambda, Load Balancer)', async () => {
      rdsSend.mockResolvedValueOnce({
        DBInstances: [
          {
            DBInstanceIdentifier: 'live-payment-db',
            DBInstanceArn: 'arn:aws:rds:ap-south-1:123456789012:db:live-payment-db',
            Engine: 'postgres',
            DBSubnetGroup: {
              VpcId: 'vpc-live-01',
              Subnets: [{ SubnetIdentifier: 'subnet-live-07' }],
            },
          },
        ],
      });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const rds = await provider.getResource('live-payment-db');

      expect(rds).not.toBeNull();
      expect(rds?.id).toBe('live-payment-db');
      expect(rds?.type).toBe('RDS');
      expect(rds?.criticality).toBe('CRITICAL');
      expect(rds?.metadata?.engine).toBe('postgres');
    });

    it('derives bidirectional dependencies in AWS mode', async () => {
      // Mock listResources responses
      ec2Send
        .mockResolvedValueOnce({
          Vpcs: [{ VpcId: 'vpc-live-01', Tags: [{ Key: 'Name', Value: 'vpc-live-01' }] }],
        })
        .mockResolvedValueOnce({
          Subnets: [
            {
              SubnetId: 'subnet-live-07',
              VpcId: 'vpc-live-01',
              Tags: [{ Key: 'Name', Value: 'subnet-live-07' }],
            },
          ],
        })
        .mockResolvedValueOnce({
          Reservations: [
            {
              Instances: [
                {
                  InstanceId: 'i-worker-01',
                  SubnetId: 'subnet-live-07',
                  SecurityGroups: [{ GroupId: 'sg-live-01' }],
                  Tags: [{ Key: 'Name', Value: 'worker-01' }],
                },
              ],
            },
          ],
        })
        .mockResolvedValueOnce({
          SecurityGroups: [{ GroupId: 'sg-live-01', GroupName: 'sg-live-01' }],
        });

      rdsSend.mockResolvedValueOnce({ DBInstances: [] });
      lambdaSend.mockResolvedValueOnce({ Functions: [] });
      ecsSend.mockResolvedValueOnce({ clusterArns: [] });
      s3Send.mockResolvedValueOnce({ Buckets: [] });
      iamSend.mockResolvedValueOnce({ Roles: [] });
      elbv2Send.mockResolvedValueOnce({ LoadBalancers: [] });

      const provider = new AWSResourceProvider('ap-south-1', mockClients);
      const deps = await provider.getDependencies('subnet-live-07');

      expect(deps.length).toBeGreaterThanOrEqual(2);

      // VPC hosts Subnet
      const vpcDep = deps.find((d) => d.relationship === 'HOSTS' && d.source === 'vpc-live-01');
      expect(vpcDep).toBeDefined();

      // Subnet hosts EC2
      const ec2HostDep = deps.find((d) => d.relationship === 'HOSTS' && d.target === 'i-worker-01');
      expect(ec2HostDep).toBeDefined();

      // EC2 depends on Subnet
      const ec2DepOnSubnet = deps.find((d) => d.relationship === 'DEPENDS_ON' && d.source === 'i-worker-01');
      expect(ec2DepOnSubnet).toBeDefined();
    });
  });

  describe('3. In-Memory Caching & Performance', () => {
    it('uses cached resource without re-invoking AWS API on repeated requests', async () => {
      const ec2Send = vi.fn().mockResolvedValue({
        Vpcs: [{ VpcId: 'vpc-cached-01', Tags: [{ Key: 'Name', Value: 'cached-vpc' }] }],
      });
      const provider = new AWSResourceProvider('ap-south-1', { ec2Client: { send: ec2Send } as any });

      // First call
      const res1 = await provider.getResource('vpc-cached-01');
      expect(res1?.id).toBe('vpc-cached-01');
      expect(ec2Send).toHaveBeenCalledTimes(1);

      // Second call should hit in-memory cache
      const res2 = await provider.getResource('vpc-cached-01');
      expect(res2?.id).toBe('vpc-cached-01');
      expect(ec2Send).toHaveBeenCalledTimes(1); // Call count remains 1!

      // Clear cache and call again
      provider.clearCache();
      const res3 = await provider.getResource('vpc-cached-01');
      expect(res3?.id).toBe('vpc-cached-01');
      expect(ec2Send).toHaveBeenCalledTimes(2); // Now called again
    });
  });

  describe('4. AWS Error Handling & Sanitization', () => {
    it('safely handles missing credentials without exposing stack trace', () => {
      const credError = new Error('Could not load credentials from any providers');
      (credError as any).name = 'CredentialsProviderError';

      const parsed = handleAWSError(credError);
      expect(parsed).toBeInstanceOf(AWSError);
      expect(parsed.statusCode).toBe(401);
      expect(parsed.code).toBe('AWS_CREDENTIALS_UNAVAILABLE');
      expect(parsed.message).toContain('AWS credentials are not configured');
    });

    it('safely handles AccessDenied / UnauthorizedOperation', () => {
      const accessError = new Error('User is not authorized to perform: ec2:DescribeSubnets');
      (accessError as any).name = 'AccessDeniedException';

      const parsed = handleAWSError(accessError, 'subnet-07');
      expect(parsed.statusCode).toBe(403);
      expect(parsed.code).toBe('AWS_ACCESS_DENIED');
      expect(parsed.message).toContain('read-only discovery permissions');
      expect(parsed.details).toEqual({ resourceId: 'subnet-07' });
    });

    it('safely handles API timeout', () => {
      const timeoutErr = new Error('Connection timed out');
      (timeoutErr as any).name = 'TimeoutError';

      const parsed = handleAWSError(timeoutErr, 'subnet-07');
      expect(parsed.statusCode).toBe(504);
      expect(parsed.code).toBe('AWS_API_TIMEOUT');
    });

    it('safely handles AWS service unavailable / throttling', () => {
      const svcErr = new Error('Rate exceeded');
      (svcErr as any).name = 'ThrottlingException';

      const parsed = handleAWSError(svcErr);
      expect(parsed.statusCode).toBe(503);
      expect(parsed.code).toBe('AWS_SERVICE_UNAVAILABLE');
    });

    it('safely handles invalid region', () => {
      const regionErr = new Error('Unknown endpoint');
      (regionErr as any).name = 'UnknownEndpoint';

      const parsed = handleAWSError(regionErr);
      expect(parsed.statusCode).toBe(400);
      expect(parsed.code).toBe('AWS_INVALID_REGION');
    });

    it('returns null when getResource encounters a 404 / NotFound error in AWS', async () => {
      const notFoundErr = new Error('Subnet ID does not exist');
      (notFoundErr as any).name = 'InvalidSubnetID.NotFound';

      const ec2Send = vi.fn().mockRejectedValue(notFoundErr);
      const provider = new AWSResourceProvider('ap-south-1', { ec2Client: { send: ec2Send } as any });

      const res = await provider.getResource('subnet-missing-99');
      expect(res).toBeNull();
    });
  });

  describe('5. Read-Only Safety Verification', () => {
    it('verifies that AWSResourceProvider contains zero mutating or destructive methods', () => {
      const provider = new AWSResourceProvider('ap-south-1');
      const prototypeKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(provider));

      const destructiveKeywords = ['delete', 'terminate', 'remove', 'create', 'update', 'modify', 'put', 'drop', 'destroy'];

      for (const key of prototypeKeys) {
        for (const kw of destructiveKeywords) {
          expect(key.toLowerCase().startsWith(kw)).toBe(false);
        }
      }
    });
  });

  describe('6. CRITICAL REGRESSION TEST: Mock Mode Still Produces 87/BLOCK for subnet-07', () => {
    it('guarantees DELETE subnet-07 produces riskScore=87, severity=CRITICAL, decision=BLOCK, affectedResources=11, criticalServices=3, externalDependencies=2', async () => {
      // Force mock mode
      const mockProvider = new MockResourceProvider();
      setResourceProvider(mockProvider);

      const request: ChangeRequest = {
        id: 'cr-stage5-regression-test',
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await supervisorAgent.orchestrateAnalysis(request);

      // Exact required metrics
      expect(result.riskScore).toBe(87);
      expect(result.severity).toBe('CRITICAL');
      expect(result.decision).toBe('BLOCK');
      expect(result.affectedResources).toBe(11);
      expect(result.criticalServices).toBe(3);
      expect(result.externalDependencies).toBe(2);

      // Exact required risk breakdown
      expect(result.riskBreakdown).toEqual({
        dependencyRisk: 25,
        criticalityRisk: 25,
        securityRisk: 15,
        policyRisk: 15,
        environmentRisk: 7,
        total: 87,
      });

      // Contract integrity
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.securityFindings.length).toBeGreaterThan(0);
      expect(result.policyViolations.length).toBe(4);
      expect(result.topology.nodes.length).toBe(11);
      expect(result.topology.edges.length).toBeGreaterThan(0);
      expect(result.metadata?.stage).toBe(5);
    });
  });
});
