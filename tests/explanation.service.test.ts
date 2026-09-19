import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExplanationService } from '../src/ai/explanation.service';
import { IBedrockClient, MockBedrockClient } from '../src/ai/bedrock.client';
import { InMemoryRequestRepository } from '../src/repositories/request.repository';
import { ChangeRequest } from '../src/models/changeRequest.model';
import { AnalysisResult } from '../src/models/analysisResult.model';

describe('ExplanationService', () => {
  let repository: InMemoryRequestRepository;
  let sampleRequest: ChangeRequest;
  let sampleAnalysis: AnalysisResult;

  beforeEach(() => {
    repository = new InMemoryRequestRepository(false);

    sampleRequest = {
      requestId: 'req_test_01',
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      status: 'BLOCKED',
      riskScore: 87,
      severity: 'CRITICAL',
      decision: 'BLOCK',
      affectedResources: 11,
      criticalServices: 3,
      externalDependencies: 2,
      createdAt: '2026-09-17T10:00:00.000Z',
      updatedAt: '2026-09-17T10:00:05.000Z',
    };

    sampleAnalysis = {
      requestId: 'req_test_01',
      resourceId: 'subnet-07',
      action: 'DELETE',
      status: 'BLOCKED',
      riskScore: 87,
      severity: 'CRITICAL',
      decision: 'BLOCK',
      affectedResources: 11,
      criticalServices: 3,
      externalDependencies: 2,
      summary: 'Deleting subnet in production impacts 11 resources.',
      policyViolations: [
        {
          policyId: 'POL-001',
          policyName: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL',
          severity: 'CRITICAL',
          description: 'Production deletion of subnet-07 violates perimeter safety gates.',
        },
      ],
      securityFindings: [
        {
          category: 'PERIMETER_ISOLATION',
          severity: 'HIGH',
          details: 'Active production interfaces bound to subnet-07.',
        },
      ],
      dependencies: [
        { id: 'payment-api', name: 'Payment API', type: 'service', tier: 'Revenue Critical', direct: true },
      ],
      impactGraph: { nodes: [], links: [] },
      analyzedAt: '2026-09-17T10:00:05.000Z',
    };
  });

  it('should generate a valid ExplanationRecord when Bedrock returns valid JSON', async () => {
    const mockBedrock = new MockBedrockClient();
    const service = new ExplanationService(mockBedrock, repository);

    await repository.createRequest(sampleRequest);
    await repository.saveAnalysisResult(sampleAnalysis);

    const result = await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);

    expect(result.requestId).toBe('req_test_01');
    expect(result.explanation).toBeDefined();
    expect(result.explanation.summary).toBeDefined();
    expect(result.explanation.whyBlocked).toContain('subnet-07');
    expect(result.explanation.impactExplanation).toContain('11');
    expect(result.explanation.keyReasons.length).toBeGreaterThan(0);
    expect(result.isFallback).toBe(false);

    // Verify stored in repository
    const stored = await repository.getExplanation('req_test_01');
    expect(stored).not.toBeNull();
    expect(stored?.explanation.summary).toBe(result.explanation.summary);
  });

  it('should clean markdown wrapped JSON (```json ... ```) and validate correctly', () => {
    const service = new ExplanationService(new MockBedrockClient(), repository);
    const markdownWrapped = `\`\`\`json
{
  "summary": "Cleaned summary",
  "whyBlocked": "Critical subnet",
  "impactExplanation": "11 resources affected",
  "securityExplanation": "None",
  "policyExplanation": "None",
  "recommendedAction": "Do not delete",
  "keyReasons": ["Reason 1", "Reason 2"]
}
\`\`\``;

    const validated = service.parseAndValidateResponse(markdownWrapped, sampleRequest, sampleAnalysis);
    expect(validated.summary).toBe('Cleaned summary');
    expect(validated.whyBlocked).toBe('Critical subnet');
    expect(validated.keyReasons).toEqual(['Reason 1', 'Reason 2']);
  });

  it('should provide deterministic fallback without failing when Bedrock throws an error', async () => {
    const failingBedrock: IBedrockClient = {
      generateExplanation: vi.fn().mockRejectedValue(new Error('Bedrock API ThrottlingException')),
    };
    const service = new ExplanationService(failingBedrock, repository);

    await repository.createRequest(sampleRequest);
    await repository.saveAnalysisResult(sampleAnalysis);

    const result = await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);

    expect(result.isFallback).toBe(true);
    const whyBlockedText = Array.isArray(result.explanation.whyBlocked)
      ? result.explanation.whyBlocked.join(' ')
      : result.explanation.whyBlocked;
    expect(whyBlockedText).toContain('critical risk score (87/100)');
    expect(result.explanation.impactExplanation).toContain('11 resources are affected');
    expect(result.explanation.impactExplanation).toContain('3 critical services');
  });

  it('should provide deterministic fallback when Bedrock returns malformed non-JSON', async () => {
    const malformedBedrock: IBedrockClient = {
      generateExplanation: vi.fn().mockResolvedValue('I am a large language model and here is some unstructured text.'),
    };
    const service = new ExplanationService(malformedBedrock, repository);

    const result = await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);

    expect(result.isFallback).toBe(true);
    expect(result.explanation.impactExplanation).toContain('11 resources are affected');
  });

  it('should reuse cached explanation if already generated (Cost & Token Control)', async () => {
    const spyBedrock = {
      generateExplanation: vi.fn().mockResolvedValue(
        JSON.stringify({
          summary: 'Original explanation',
          whyBlocked: 'Blocked',
          impactExplanation: '11 affected',
          securityExplanation: 'Sec',
          policyExplanation: 'Pol',
          recommendedAction: 'Rec',
          keyReasons: ['K1'],
        })
      ),
    };
    const service = new ExplanationService(spyBedrock, repository);

    await repository.createRequest(sampleRequest);
    await repository.saveAnalysisResult(sampleAnalysis);

    // First call invokes Bedrock
    const first = await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);
    expect(spyBedrock.generateExplanation).toHaveBeenCalledTimes(1);

    // Second call reuses cached explanation from repository without calling Bedrock
    const second = await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);
    expect(spyBedrock.generateExplanation).toHaveBeenCalledTimes(1);
    expect(second.explanation.summary).toBe(first.explanation.summary);
  });

  it('CRITICAL: Should never modify Person 1 deterministic analysis results', async () => {
    const mockBedrock = new MockBedrockClient();
    const service = new ExplanationService(mockBedrock, repository);

    await repository.createRequest(sampleRequest);
    await repository.saveAnalysisResult(sampleAnalysis);

    await service.generateOrGetExplanation(sampleRequest, sampleAnalysis);

    // Verify Person 1 fields remain 100% untouched
    const reloadedAnalysis = await repository.getAnalysisResult(sampleRequest.requestId);
    expect(reloadedAnalysis?.riskScore).toBe(87);
    expect(reloadedAnalysis?.severity).toBe('CRITICAL');
    expect(reloadedAnalysis?.decision).toBe('BLOCK');
    expect(reloadedAnalysis?.affectedResources).toBe(11);
    expect(reloadedAnalysis?.criticalServices).toBe(3);
    expect(reloadedAnalysis?.externalDependencies).toBe(2);

    const reloadedRequest = await repository.getRequest(sampleRequest.requestId);
    expect(reloadedRequest?.riskScore).toBe(87);
    expect(reloadedRequest?.status).toBe('BLOCKED');
  });
});
