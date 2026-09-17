import { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/AnalysisService';
import { changeRequestService } from '../services/ChangeRequestService';
import { impactService } from '../services/ImpactService';
import { sendSuccess } from '../utils/response';
import { validateRequestIdParam } from '../utils/validation';

export async function createRequestHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const changeRequest = await changeRequestService.createRequest(req.body);
    sendSuccess(res, changeRequest, 201);
  } catch (err) {
    next(err);
  }
}

export async function listRequestsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requests = await changeRequestService.listRequests();
    sendSuccess(res, requests, 200, { total: requests.length });
  } catch (err) {
    next(err);
  }
}

export async function getRequestByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestId = validateRequestIdParam(req.params.requestId);
    const request = await changeRequestService.getRequestById(requestId);
    sendSuccess(res, request, 200);
  } catch (err) {
    next(err);
  }
}

export async function analyzeRequestHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestId = validateRequestIdParam(req.params.requestId);
    const analysis = await analysisService.runPlaceholderAnalysis(requestId);
    sendSuccess(res, analysis, 200);
  } catch (err) {
    next(err);
  }
}

export async function getRequestImpactHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requestId = validateRequestIdParam(req.params.requestId);
    const request = await changeRequestService.getRequestById(requestId);
    const impact = await impactService.calculateImpact(request.resourceId);
    sendSuccess(res, impact, 200);
  } catch (err) {
    next(err);
  }
}
