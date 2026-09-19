import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service';
import { ResponseMapper } from '../services/response.mapper';

export class RequestsHandler {
  constructor(private readonly requestService: RequestService) {}

  /**
   * POST /api/requests
   * Create a new Change Request in PENDING status.
   */
  createRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.requestService.createRequest(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/requests
   * List recent Change Requests with optional ?status= filter.
   */
  listRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statusFilter = req.query.status as string | undefined;
      const requests = await this.requestService.listRequests(statusFilter);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/requests/:requestId
   * Get full details and analysis result for a specific Change Request.
   */
  getRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
      const request = await this.requestService.getRequest(requestId);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/requests/:requestId/analyze
   * Trigger Person 1's Infrastructure Intelligence pipeline for a Change Request.
   */
  analyzeRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
      const analysisResult = await this.requestService.analyzeRequest(requestId);
      res.status(200).json(ResponseMapper.toAnalysisResponse(analysisResult));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/requests/:requestId/impact
   * Get Person 1's ImpactGraph for a specific Change Request.
   */
  getImpactGraph = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
      const impactGraph = await this.requestService.getImpactGraph(requestId);
      res.status(200).json(impactGraph);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/requests/:requestId/explain
   * Generate or retrieve a human-readable AI explanation using Amazon Bedrock.
   */
  generateExplanation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
      const force = req.query.force === 'true' || req.body?.force === true;
      const explanationRecord = await this.requestService.generateExplanation(requestId, force);
      res.status(200).json(ResponseMapper.toExplanationResponse(explanationRecord));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/requests/:requestId/explanation
   * Retrieve a previously generated AI explanation for a Change Request.
   */
  getExplanation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
      const explanationRecord = await this.requestService.getExplanation(requestId);
      res.status(200).json(ResponseMapper.toExplanationResponse(explanationRecord));
    } catch (error) {
      next(error);
    }
  };
}


