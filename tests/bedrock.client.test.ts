import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockClientWrapper, MockBedrockClient } from '../src/ai/bedrock.client';
import { ExplanationInput } from '../src/ai/types/explanation.model';

describe('BedrockClient & BedrockClientWrapper', () => {
  const bedrockMock = mockClient(BedrockRuntimeClient);
  const sampleInput: ExplanationInput = {
    resource: {
      id: 'subnet-07',
      type: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    },
    change: {
      action: 'DELETE',
    },
    risk: {
      score: 87,
      severity: 'CRITICAL',
      decision: 'BLOCK',
    },
    impact: {
      affectedResources: 11,
      criticalServices: 3,
      externalDependencies: 2,
    },
    securityFindings: [
      {
        category: 'PERIMETER_ISOLATION',
        severity: 'HIGH',
        details: 'Active ENI interfaces bound with no standby failover in alternate AZ.',
      },
    ],
    policyViolations: [
      {
        policyId: 'POL-001',
        policyName: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL',
        severity: 'CRITICAL',
        description: 'Production deletion violates automated governance.',
      },
    ],
    dependencies: [
      { id: 'payment-api', name: 'Payment API', type: 'service', tier: 'Revenue Critical', direct: true },
    ],
  };

  beforeEach(() => {
    bedrockMock.reset();
  });

  afterEach(() => {
    bedrockMock.restore();
  });

  describe('MockBedrockClient', () => {
    it('should generate valid mock JSON explanation matching the input metrics', async () => {
      const mockClient = new MockBedrockClient();
      const raw = await mockClient.generateExplanation(sampleInput);

      expect(typeof raw).toBe('string');
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('whyBlocked');
      expect(parsed).toHaveProperty('impactExplanation');
      expect(parsed).toHaveProperty('keyReasons');
      expect(parsed.summary).toContain('subnet-07');
    });

    it('should throw error when configured to simulate failure', async () => {
      const failingMock = new MockBedrockClient(true);
      await expect(failingMock.generateExplanation(sampleInput)).rejects.toThrow('unavailable');
    });
  });

  describe('BedrockClientWrapper with AWS SDK Mock', () => {
    it('should issue ConverseCommand to Bedrock Runtime and return text content', async () => {
      const mockJson = JSON.stringify({
        summary: 'Bedrock generated summary',
        whyBlocked: 'Production subnet deletion blocked',
        impactExplanation: '11 resources affected',
        securityExplanation: 'Active ENIs bound',
        policyExplanation: 'Requires approval',
        recommendedAction: 'Obtain approval',
        keyReasons: ['Critical subnet', 'Score 87/100'],
      });

      bedrockMock.on(ConverseCommand).resolves({
        output: {
          message: {
            role: 'assistant',
            content: [{ text: mockJson }],
          },
        },
      });

      const wrapper = new BedrockClientWrapper(bedrockMock as unknown as BedrockRuntimeClient, 'anthropic.claude-3-5-sonnet-20240620-v1:0');
      const result = await wrapper.generateExplanation(sampleInput);

      expect(result).toBe(mockJson);
      expect(bedrockMock.calls()).toHaveLength(1);
      const call = bedrockMock.call(0);
      expect(call.args[0].input.modelId).toBe('anthropic.claude-3-5-sonnet-20240620-v1:0');
    });

    it('should throw error when Bedrock returns empty response content', async () => {
      bedrockMock.on(ConverseCommand).resolves({
        output: {
          message: {
            role: 'assistant',
            content: [],
          },
        },
      });

      const wrapper = new BedrockClientWrapper(bedrockMock as unknown as BedrockRuntimeClient);
      await expect(wrapper.generateExplanation(sampleInput)).rejects.toThrow('empty response');
    });
  });
});
