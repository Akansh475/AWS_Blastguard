import { IRequestRepository } from '../repositories/request.repository';
import { IAnalysisOrchestrator } from '../orchestration/analysis.orchestrator';
import { ExplanationService } from '../ai/explanation.service';
import { createBedrockClient } from '../ai/bedrock.client';
import { ValidationService } from './validation.service';
import { ResponseMapper, RequestDetailResponse, RequestSummaryResponse } from './response.mapper';
import { ChangeRequest, RequestFilterOptions, RequestStatus } from '../models/changeRequest.model';
import { AnalysisResult, ImpactGraph } from '../models/analysisResult.model';
import { ExplanationRecord } from '../ai/types/explanation.model';
import { NotFoundError, AnalysisError, AnalysisRequiredError, ExplanationNotFoundError } from '../models/errors.model';
import { generateRequestId } from '../utils/idGenerator';
import { logger } from '../utils/logger';

export class RequestService {
  private readonly explanationService: ExplanationService;

  constructor(
    private readonly repository: IRequestRepository,
    private readonly orchestrator: IAnalysisOrchestrator,
    explanationService?: ExplanationService
  ) {
    this.explanationService = explanationService || new ExplanationService(createBedrockClient(), repository);
  }

  /**
   * Create a new Change Request in PENDING status.
   */
  async createRequest(dto: unknown): Promise<{ requestId: string; status: string }> {
    const validated = ValidationService.validateCreateRequest(dto);

    const now = new Date().toISOString();
    const newRequest: ChangeRequest = {
      requestId: generateRequestId(),
      action: validated.action,
      resourceId: validated.resourceId,
      resourceType: validated.resourceType,
      region: validated.region,
      environment: validated.environment,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.repository.createRequest(newRequest);
    logger.info(`Created new change request`, { requestId: created.requestId, resourceId: created.resourceId });

    return ResponseMapper.toCreateResponse(created);
  }

  /**
   * List recent Change Requests with optional status filter.
   */
  async listRequests(statusFilter?: string): Promise<RequestSummaryResponse[]> {
    const filter: RequestFilterOptions = {};
    if (statusFilter) {
      const normalizedStatus = statusFilter.trim().toUpperCase() as RequestStatus;
      filter.status = normalizedStatus;
    }

    const requests = await this.repository.listRequests(filter);
    return requests.map((req) => ResponseMapper.toSummaryResponse(req));
  }

  /**
   * Get full details of a Change Request including analysis result if available.
   */
  async getRequest(requestId: string): Promise<RequestDetailResponse> {
    if (!requestId || typeof requestId !== 'string') {
      throw new NotFoundError(`Invalid request ID`);
    }

    const request = await this.repository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`Change request '${requestId}' was not found`);
    }

    const analysis = await this.repository.getAnalysisResult(requestId);
    return ResponseMapper.toDetailResponse(request, analysis);
  }

  /**
   * Trigger Infrastructure Analysis for a Change Request.
   * Enforces full request lifecycle: PENDING -> ANALYZING -> SAFE / REVIEW / BLOCKED (or FAILED on error).
   */
  async analyzeRequest(requestId: string): Promise<AnalysisResult> {
    const request = await this.repository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`Change request '${requestId}' was not found`);
    }

    // 1. Move status to ANALYZING
    await this.repository.updateRequestStatus(requestId, 'ANALYZING');
    logger.info(`Request moved to ANALYZING state`, { requestId });

    try {
      // 2. Delegate to AnalysisOrchestrator -> Person 1's Infrastructure Intelligence
      const analysisResult = await this.orchestrator.executeAnalysis(request);

      // 3. Save analysis result
      await this.repository.saveAnalysisResult(analysisResult);

      // 4. Update request status based on deterministic decision
      let finalStatus: RequestStatus = 'SAFE';
      if (analysisResult.decision === 'BLOCK' || analysisResult.status === 'BLOCKED') {
        finalStatus = 'BLOCKED';
      } else if (analysisResult.decision === 'REVIEW' || analysisResult.status === 'REVIEW') {
        finalStatus = 'REVIEW';
      } else if (analysisResult.decision === 'ALLOW' || analysisResult.status === 'SAFE') {
        finalStatus = 'SAFE';
      }

      await this.repository.updateRequestStatus(requestId, finalStatus, analysisResult.riskScore);
      logger.info(`Analysis succeeded, request status updated`, {
        requestId,
        finalStatus,
        riskScore: analysisResult.riskScore,
      });

      return analysisResult;
    } catch (error) {
      // 5. On failure, explicitly mark status as FAILED - never mark SAFE on failure!
      await this.repository.updateRequestStatus(requestId, 'FAILED');
      logger.error(`Analysis failed for request, status set to FAILED`, error, { requestId });

      if (error instanceof AnalysisError) {
        throw error;
      }
      throw new AnalysisError(
        error instanceof Error ? error.message : 'Analysis failed due to unexpected infrastructure error'
      );
    }
  }

  /**
   * Get Person 1's ImpactGraph for a specific Change Request.
   */
  async getImpactGraph(requestId: string): Promise<ImpactGraph> {
    if (!requestId || typeof requestId !== 'string') {
      throw new NotFoundError(`Invalid request ID`);
    }

    const request = await this.repository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`Change request '${requestId}' was not found`);
    }

    const analysis = await this.repository.getAnalysisResult(requestId);
    if (analysis && analysis.impactGraph) {
      return analysis.impactGraph;
    }

    throw new NotFoundError(`Impact graph not found for request '${requestId}'. Analysis has not been completed.`);
  }

  /**
   * Generate or retrieve a human-readable explanation using Amazon Bedrock AI.
   * Requires that the request has already completed Person 1 analysis.
   */
  async generateExplanation(requestId: string, forceRegenerate = false): Promise<ExplanationRecord> {
    if (!requestId || typeof requestId !== 'string') {
      throw new NotFoundError(`Invalid request ID`);
    }

    const request = await this.repository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`Change request '${requestId}' was not found`);
    }

    const analysis = await this.repository.getAnalysisResult(requestId);
    if (!analysis) {
      throw new AnalysisRequiredError(
        `Change request '${requestId}' must be analyzed before generating an AI explanation.`
      );
    }

    return this.explanationService.generateOrGetExplanation(request, analysis, forceRegenerate);
  }

  /**
   * Retrieve a previously generated AI explanation for a Change Request.
   */
  async getExplanation(requestId: string): Promise<ExplanationRecord> {
    if (!requestId || typeof requestId !== 'string') {
      throw new NotFoundError(`Invalid request ID`);
    }

    const request = await this.repository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`Change request '${requestId}' was not found`);
    }

    const explanation = await this.repository.getExplanation(requestId);
    if (!explanation) {
      throw new ExplanationNotFoundError(
        `No AI explanation found for change request '${requestId}'. Run POST /api/requests/${requestId}/explain first.`
      );
    }

    return explanation;
  }
}



