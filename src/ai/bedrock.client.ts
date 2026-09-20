import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ExplanationInput } from './types/explanation.model';
import { SYSTEM_PROMPT, formatUserPrompt } from './prompts/risk-explanation.prompt';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface IBedrockClient {
  generateExplanation(input: ExplanationInput): Promise<string>;
}

/**
 * AWS Amazon Bedrock Client implementation using Converse API (Claude 3.5 / Amazon Nova compatible).
 */
export class BedrockClientWrapper implements IBedrockClient {
  private readonly client: BedrockRuntimeClient;
  private readonly modelId: string;

  constructor(client?: BedrockRuntimeClient, modelId?: string) {
    this.modelId = modelId || config.bedrockModelId || 'anthropic.claude-3-5-sonnet-20240620-v1:0';
    this.client =
      client ||
      new BedrockRuntimeClient({
        region: config.awsRegion,
      });
  }

  async generateExplanation(input: ExplanationInput): Promise<string> {
    logger.info(`Invoking Amazon Bedrock model ${this.modelId} for explanation`, {
      resourceId: input.resource.id,
      action: input.change.action,
      decision: input.risk.decision,
    });

    const userMessage = formatUserPrompt(input);

    const command = new ConverseCommand({
      modelId: this.modelId,
      system: [{ text: SYSTEM_PROMPT }],
      messages: [
        {
          role: 'user',
          content: [{ text: userMessage }],
        },
      ],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.1,
        topP: 0.9,
      },
    });

    const response = await this.client.send(command);
    const contentBlock = response.output?.message?.content?.[0];

    if (!contentBlock || !contentBlock.text) {
      throw new Error(`Bedrock returned empty response content for model ${this.modelId}`);
    }

    return contentBlock.text;
  }
}

/**
 * Deterministic Mock Bedrock Client for local development and automated testing.
 */
export class MockBedrockClient implements IBedrockClient {
  constructor(private readonly shouldFail = false) {}

  async generateExplanation(input: ExplanationInput): Promise<string> {
    if (this.shouldFail) {
      throw new Error('Amazon Bedrock service is currently unavailable (ThrottlingException: Rate exceeded)');
    }

    const { resource, change, risk, impact, policyViolations, securityFindings } = input;

    let summary = `Change ${change.action} on ${resource.id} in ${resource.environment} evaluated with risk score ${risk.score}/100.`;
    let whyBlocked = `Request is ${risk.decision === 'BLOCK' ? 'blocked' : risk.decision === 'REVIEW' ? 'pending review' : 'approved'} based on automated infrastructure safety rules.`;
    let impactExplanation = `${impact.affectedResources} downstream resources are in scope, including ${impact.criticalServices} critical services and ${impact.externalDependencies} external dependencies.`;
    let securityExplanation = securityFindings.length > 0
      ? securityFindings.map((s) => s.details).join('; ')
      : 'No active security perimeter findings detected.';
    let policyExplanation = policyViolations.length > 0
      ? policyViolations.map((p) => p.description).join('; ')
      : 'All compliance and governance guardrails passed.';
    let recommendedAction = risk.decision === 'BLOCK'
      ? `Do not proceed with deleting ${resource.id} without isolating dependencies and obtaining perimeter approval.`
      : risk.decision === 'REVIEW'
      ? `Verify staging blast radius thresholds and submit for team lead review.`
      : `Proceed with change following standard deployment checklist.`;

    if (change.action === 'DELETE' && resource.id === 'subnet-07' && resource.environment === 'PRODUCTION') {
      summary = `Deleting subnet-07 in PRODUCTION is blocked due to critical risk (Score: ${risk.score}/100) affecting ${impact.affectedResources} resources.`;
      whyBlocked = `Deleting subnet-07 is blocked because it is a critical production subnet providing active network interfaces for ${impact.criticalServices} revenue-critical services.`;
      impactExplanation = `${impact.affectedResources} downstream resources will lose network connectivity, directly impacting ${impact.criticalServices} critical services and ${impact.externalDependencies} external dependencies.`;
      securityExplanation = `Active production Elastic Network Interfaces are bound to subnet-07 with no standby failover in alternate AZ.`;
      policyExplanation = `Violates PRODUCTION_CHANGE_REQUIRES_APPROVAL governance policy.`;
      recommendedAction = `Reroute payment-api and auth-broker network interfaces to alternate subnets before scheduling subnet decommission.`;
    }

    const mockResult = {
      summary,
      whyBlocked,
      impactExplanation,
      securityExplanation,
      policyExplanation,
      recommendedAction,
      keyReasons: [
        `${resource.environment} ${resource.type} ${change.action}`,
        `${impact.affectedResources} affected resources`,
        `${impact.criticalServices} critical services impacted`,
        `${impact.externalDependencies} external dependencies`,
        `Risk Score: ${risk.score}/100 (${risk.severity})`,
      ],
    };

    return JSON.stringify(mockResult);
  }
}

export function createBedrockClient(): IBedrockClient {
  if (config.mode === 'aws') {
    logger.info(`Initializing AWS Bedrock Client (Region: ${config.awsRegion}, Model: ${config.bedrockModelId})`);
    return new BedrockClientWrapper();
  }

  logger.info(`Initializing Mock Bedrock Client (BLASTGUARD_MODE: mock)`);
  return new MockBedrockClient();
}
