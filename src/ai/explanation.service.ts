import { ChangeRequest } from '../models/changeRequest.model';
import { AnalysisResult } from '../models/analysisResult.model';
import { IBedrockClient } from './bedrock.client';
import { ExplanationInput, ExplanationResult, ExplanationRecord } from './types/explanation.model';
import { IRequestRepository } from '../repositories/request.repository';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * BedrockExplanationService manages the AI-powered explanation layer.
 * Transforms Person 1's authoritative AnalysisResult into clear, structured human-readable explanations.
 */
export class BedrockExplanationService {
  constructor(
    private readonly bedrockClient: IBedrockClient,
    private readonly repository?: IRequestRepository
  ) {}

  /**
   * Constructs sanitized, decoupled input for Bedrock from the change request and deterministic analysis.
   * Minimizes tokens and ensures private infrastructure metadata is treated strictly as data.
   */
  public buildExplanationInput(request: ChangeRequest, analysis: AnalysisResult): ExplanationInput {
    return {
      resource: {
        id: request.resourceId,
        type: request.resourceType,
        region: request.region,
        environment: request.environment,
      },
      change: {
        action: request.action,
      },
      risk: {
        score: analysis.riskScore,
        severity: analysis.severity,
        decision: analysis.decision,
      },
      impact: {
        affectedResources: analysis.affectedResources,
        criticalServices: analysis.criticalServices,
        externalDependencies: analysis.externalDependencies,
      },
      securityFindings: (analysis.securityFindings || []).map((s) => ({
        category: s.category,
        severity: s.severity,
        details: s.details,
      })),
      policyViolations: (analysis.policyViolations || []).map((p) => ({
        policyId: p.policyId,
        policyName: p.policyName,
        severity: p.severity,
        description: p.description,
      })),
      dependencies: (analysis.dependencies || []).map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        tier: d.tier,
        direct: d.direct,
      })),
    };
  }

  /**
   * Generates or retrieves a structured human-readable AI explanation for an analyzed ChangeRequest.
   * If Bedrock is unavailable, times out, or fails, returns a deterministic fallback without failing the safety lifecycle.
   */
  async generateOrGetExplanation(
    request: ChangeRequest,
    analysis: AnalysisResult,
    forceRegenerate = false
  ): Promise<ExplanationRecord> {
    // 1. Cost & Token Control: Check cache if explanation already generated for this request
    if (!forceRegenerate && this.repository) {
      const existing = await this.repository.getExplanation(request.requestId);
      if (existing && existing.explanation) {
        logger.info(`Reusing cached AI explanation for ${request.requestId}`);
        return existing;
      }
    }

    const input = this.buildExplanationInput(request, analysis);

    let explanationResult: ExplanationResult;
    let isFallback = false;
    const now = new Date().toISOString();
    const model = (config.mode === 'aws' ? config.bedrockModelId : 'mock-bedrock-v1') || 'mock-bedrock-v1';

    try {
      // 2. Invoke Bedrock Client
      const rawResponse = await this.bedrockClient.generateExplanation(input);

      // 3. Validate and Parse LLM response against schema
      explanationResult = this.parseAndValidateResponse(rawResponse, request, analysis);
      logger.info(`Successfully generated and validated AI explanation for ${request.requestId}`);
    } catch (error) {
      // 4. Fallback Behavior: Generate deterministic fallback directly from AnalysisResult
      logger.warn(`Bedrock explanation generation failed; applying deterministic fallback explanation`, {
        requestId: request.requestId,
        error: error instanceof Error ? error.message : 'Unknown Bedrock error',
      });
      explanationResult = this.createDeterministicFallback(request, analysis);
      isFallback = true;
    }

    const record: ExplanationRecord = {
      requestId: request.requestId,
      explanation: explanationResult,
      generatedAt: now,
      model,
      version: '1.0.0',
      isFallback,
    };

    // 5. Persist explanation in repository
    if (this.repository) {
      await this.repository.saveExplanation(request.requestId, record);
    }

    return record;
  }

  /**
   * Validates the structure and schema of the model response.
   * Ensures rogue or malformed LLM responses never override deterministic decisions.
   */
  public parseAndValidateResponse(
    rawText: string,
    request: ChangeRequest,
    analysis: AnalysisResult
  ): ExplanationResult {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Empty or invalid response received from Bedrock');
    }

    // Clean markdown code block wraps (```json ... ```)
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      throw new Error(`Bedrock output was not valid JSON: ${(e as Error).message}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed output is not an object');
    }

    const headline = typeof parsed.headline === 'string' && parsed.headline.trim()
      ? parsed.headline.trim()
      : `Change ${analysis.decision === 'BLOCK' ? 'Blocked' : analysis.decision === 'REVIEW' ? 'Requires Review' : 'Approved'}: ${request.action} ${request.resourceId}`;

    const summary = typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : null;

    let whyBlocked: string[] | string = [];
    if (Array.isArray(parsed.whyBlocked)) {
      whyBlocked = parsed.whyBlocked.filter((r) => typeof r === 'string' && r.trim().length > 0);
    } else if (typeof parsed.whyBlocked === 'string' && parsed.whyBlocked.trim()) {
      whyBlocked = parsed.whyBlocked.trim();
    }

    const impactSummary =
      typeof parsed.impactSummary === 'string' && parsed.impactSummary.trim()
        ? parsed.impactSummary.trim()
        : typeof parsed.impactExplanation === 'string' && parsed.impactExplanation.trim()
        ? parsed.impactExplanation.trim()
        : null;

    const riskExplanation =
      typeof parsed.riskExplanation === 'string' && parsed.riskExplanation.trim()
        ? parsed.riskExplanation.trim()
        : `Risk Score is ${analysis.riskScore}/100 (${analysis.severity}) based on ${analysis.affectedResources} downstream dependencies in ${request.environment}.`;

    const securityExplanation =
      typeof parsed.securityExplanation === 'string' && parsed.securityExplanation.trim()
        ? parsed.securityExplanation.trim()
        : analysis.securityFindings && analysis.securityFindings.length > 0
        ? analysis.securityFindings.map((s) => s.details).join('; ')
        : 'No security findings were identified by the current analysis.';

    const policyExplanation =
      typeof parsed.policyExplanation === 'string' && parsed.policyExplanation.trim()
        ? parsed.policyExplanation.trim()
        : analysis.policyViolations && analysis.policyViolations.length > 0
        ? analysis.policyViolations.map((p) => p.description).join('; ')
        : 'All policy compliance guardrails passed.';

    let recommendedActions: string[] = [];
    if (Array.isArray(parsed.recommendedActions)) {
      recommendedActions = parsed.recommendedActions.filter((r) => typeof r === 'string' && r.trim().length > 0);
    } else if (typeof parsed.recommendedAction === 'string' && parsed.recommendedAction.trim()) {
      recommendedActions = [parsed.recommendedAction.trim()];
    }

    let keyReasons: string[] = [];
    if (Array.isArray(parsed.keyReasons)) {
      keyReasons = parsed.keyReasons.filter((r) => typeof r === 'string' && r.trim().length > 0);
    }

    if (!summary || !impactSummary) {
      throw new Error('Bedrock output missing required fields (summary or impactSummary)');
    }

    return {
      headline,
      summary,
      whyBlocked,
      impactSummary,
      impactExplanation: impactSummary,
      riskExplanation,
      securityExplanation,
      policyExplanation,
      recommendedActions:
        recommendedActions.length > 0
          ? recommendedActions
          : ['Review affected services and obtain appropriate sign-off before proceeding.'],
      recommendedAction:
        recommendedActions.length > 0 ? recommendedActions[0] : 'Review affected services before proceeding.',
      keyReasons:
        keyReasons.length > 0
          ? keyReasons
          : [
              `${request.environment} ${request.resourceType} ${request.action}`,
              `Risk Score: ${analysis.riskScore}/100 (${analysis.severity})`,
              `${analysis.affectedResources} downstream resources impacted`,
            ],
    };
  }

  /**
   * Deterministic fallback generator creating human-readable explanation directly from AnalysisResult.
   * Guarantees 0-dependency explanation without modifying deterministic safety metrics.
   */
  public createDeterministicFallback(request: ChangeRequest, analysis: AnalysisResult): ExplanationResult {
    const isBlocked = analysis.decision === 'BLOCK' || analysis.status === 'BLOCKED';
    const isReview = analysis.decision === 'REVIEW' || analysis.status === 'REVIEW';

    const headline = isBlocked
      ? `Change Blocked: ${request.action} on ${request.resourceId}`
      : isReview
      ? `Change Requires Review: ${request.action} on ${request.resourceId}`
      : `Change Approved: ${request.action} on ${request.resourceId}`;

    const whyBlockedList = isBlocked
      ? [
          `BlastGuard blocked this change because ${request.resourceId} is a critical ${request.environment} resource with active downstream dependencies.`,
          `Change was blocked due to critical risk score (${analysis.riskScore}/100) exceeding deployment threshold.`,
          `Deleting this resource impacts ${analysis.criticalServices} critical tier services and ${analysis.externalDependencies} external dependencies.`,
        ]
      : isReview
      ? [
          `Change in ${request.environment} environment requires architectural verification.`,
          `Risk score is ${analysis.riskScore}/100.`,
        ]
      : [`Change evaluated with low risk score (${analysis.riskScore}/100) and no policy violations.`];

    const whyBlockedStr = whyBlockedList.join(' ');

    const impactSummary = `BlastGuard identified that ${analysis.affectedResources} resources are affected in the blast radius, including ${analysis.criticalServices} critical services and ${analysis.externalDependencies} external dependencies in ${request.region}.`;

    const riskExplanation = `Risk score of ${analysis.riskScore}/100 (${analysis.severity} severity) assigned due to ${analysis.affectedResources} affected resources in ${request.environment}.`;

    const securityExplanation =
      analysis.securityFindings && analysis.securityFindings.length > 0
        ? analysis.securityFindings.map((s) => s.details).join('; ')
        : 'No security findings were identified by the current analysis.';

    const policyExplanation =
      analysis.policyViolations && analysis.policyViolations.length > 0
        ? analysis.policyViolations.map((p) => p.description).join('; ')
        : 'All compliance and governance guardrails evaluated.';

    const recommendedActions = isBlocked
      ? [
          `Review the ${analysis.affectedResources} affected downstream resources before attempting this change.`,
          `Confirm whether dependent workloads can be migrated to alternate subnets.`,
          `Obtain required production change approval.`,
        ]
      : isReview
      ? [
          `Conduct manual verification of blast radius.`,
          `Submit for team lead sign-off.`,
        ]
      : [`Proceed with change execution following standard deployment procedure.`];

    return {
      headline,
      summary: analysis.summary || `BlastGuard evaluated ${request.action} on ${request.resourceId} with decision ${analysis.decision}.`,
      whyBlocked: whyBlockedList,
      impactSummary,
      impactExplanation: impactSummary,
      riskExplanation,
      securityExplanation,
      policyExplanation,
      recommendedActions,
      recommendedAction: recommendedActions[0],
      keyReasons: [
        `${request.environment} ${request.resourceType} ${request.action}`,
        `Risk Score: ${analysis.riskScore}/100 (${analysis.severity})`,
        `Decision: ${analysis.decision}`,
        `${analysis.affectedResources} downstream resources affected`,
        `${analysis.criticalServices} critical services impacted`,
      ],
    };
  }
}

// Export alias for backward compatibility
export const ExplanationService = BedrockExplanationService;
export type ExplanationService = BedrockExplanationService;
