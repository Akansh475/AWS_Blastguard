import { v4 as uuidv4 } from 'uuid';
import { ChangeRequest, ChangeStatus, CreateChangeRequestDTO } from '../models/ChangeRequest';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export class ChangeRequestService {
  private requests: Map<string, ChangeRequest> = new Map();

  constructor() {
    // Initialize with a sample change request for developer convenience
    const sampleId = 'cr-prod-sample-01';
    this.requests.set(sampleId, {
      id: sampleId,
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      details: {
        reason: 'Decommissioning legacy private subnet',
      },
    });
  }

  async createRequest(dto: CreateChangeRequestDTO): Promise<ChangeRequest> {
    const id = `cr-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString();

    const newRequest: ChangeRequest = {
      id,
      action: dto.action,
      resourceId: dto.resourceId,
      resourceType: dto.resourceType,
      region: dto.region,
      environment: dto.environment,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      ...(dto.details ? { details: dto.details } : {}),
    };

    this.requests.set(id, newRequest);
    logger.info(`ChangeRequest created: ${id}`, { action: dto.action, resourceId: dto.resourceId });
    return newRequest;
  }

  async listRequests(): Promise<ChangeRequest[]> {
    return Array.from(this.requests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getRequestById(id: string): Promise<ChangeRequest> {
    const request = this.requests.get(id);
    if (!request) {
      throw new NotFoundError(`ChangeRequest with ID '${id}' not found`);
    }
    return request;
  }

  async updateRequestStatus(id: string, status: ChangeStatus): Promise<ChangeRequest> {
    const request = await this.getRequestById(id);
    const updated: ChangeRequest = {
      ...request,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.requests.set(id, updated);
    logger.info(`ChangeRequest status updated: ${id} -> ${status}`);
    return updated;
  }

  clear(): void {
    this.requests.clear();
  }
}

export const changeRequestService = new ChangeRequestService();
