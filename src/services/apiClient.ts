import { CreateChangeRequestDTO, RequestStatus } from '../models/changeRequest.model';
import { RequestDetailResponse, RequestSummaryResponse } from './response.mapper';
import { AnalysisResult } from '../models/analysisResult.model';

const API_BASE = 'http://localhost:4000/api';

export class BlastGuardApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      const errorCode = data?.error?.code || 'API_ERROR';
      const error = new Error(errorMessage) as Error & { code?: string; status?: number };
      error.code = errorCode;
      error.status = response.status;
      throw error;
    }

    return data as T;
  }

  /**
   * POST /api/requests
   * Submit a new infrastructure change request.
   */
  public static async createRequest(dto: CreateChangeRequestDTO): Promise<{ requestId: string; status: string }> {
    return this.request<{ requestId: string; status: string }>('/requests', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  /**
   * GET /api/requests
   * Fetch recent change requests with optional status filter.
   */
  public static async listRequests(status?: RequestStatus | 'All'): Promise<RequestSummaryResponse[]> {
    const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<RequestSummaryResponse[]>(`/requests${query}`, {
      method: 'GET',
    });
  }

  /**
   * GET /api/requests/:requestId
   * Fetch complete change request details and analysis result.
   */
  public static async getRequestById(requestId: string): Promise<RequestDetailResponse> {
    return this.request<RequestDetailResponse>(`/requests/${encodeURIComponent(requestId)}`, {
      method: 'GET',
    });
  }

  /**
   * POST /api/requests/:requestId/analyze
   * Trigger the infrastructure analysis pipeline for a change request.
   */
  public static async analyzeRequest(requestId: string): Promise<AnalysisResult> {
    return this.request<AnalysisResult>(`/requests/${encodeURIComponent(requestId)}/analyze`, {
      method: 'POST',
    });
  }
}
