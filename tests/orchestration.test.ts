import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RequestService } from '../src/services/request.service';
import { InMemoryRequestRepository } from '../src/repositories/request.repository';
import { AnalysisOrchestrator } from '../src/orchestration/analysis.orchestrator';
import { IInfrastructureIntelligenceProvider, InfrastructureIntelligenceProvider } from '../src/orchestration/infrastructure.provider';
import { AnalysisError, NotFoundError } from '../src/models/errors.model';

describe('RequestService & AnalysisOrchestrator Lifecycle', () => {
  let repository: InMemoryRequestRepository;
  let intelligenceProvider: IInfrastructureIntelligenceProvider;
  let orchestrator: AnalysisOrchestrator;
  let service: RequestService;

  beforeEach(() => {
    repository = new InMemoryRequestRepository(false);
    intelligenceProvider = new InfrastructureIntelligenceProvider();
    orchestrator = new AnalysisOrchestrator(intelligenceProvider);
    service = new RequestService(repository, orchestrator);
  });

  it('should successfully progress through PENDING -> ANALYZING -> BLOCKED for production subnet deletion', async () => {
    // 1. Create request
    const created = await service.createRequest({
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });

    expect(created.status).toBe('PENDING');

    // 2. Trigger analysis
    const analysis = await service.analyzeRequest(created.requestId);

    expect(analysis.riskScore).toBe(87);
    expect(analysis.decision).toBe('BLOCK');
    expect(analysis.severity).toBe('CRITICAL');
    expect(analysis.affectedResources).toBe(11);
    expect(analysis.criticalServices).toBe(3);

    // 3. Verify request in repository was updated to BLOCKED
    const reloaded = await service.getRequest(created.requestId);
    expect(reloaded.status).toBe('BLOCKED');
    expect(reloaded.riskScore).toBe(87);
    expect(reloaded.analysis).toBeDefined();
    expect(reloaded.analysis?.decision).toBe('BLOCK');
  });

  it('should explicitly mark status as FAILED when infrastructure analysis fails', async () => {
    // Mock failing provider
    const failingProvider: IInfrastructureIntelligenceProvider = {
      analyzeInfrastructureChange: vi.fn().mockRejectedValue(new Error('AWS IAM Digital Twin connection timeout')),
    };
    const failingOrchestrator = new AnalysisOrchestrator(failingProvider);
    const failingService = new RequestService(repository, failingOrchestrator);

    const created = await failingService.createRequest({
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });

    // Analysis should throw AnalysisError
    await expect(failingService.analyzeRequest(created.requestId)).rejects.toThrow(AnalysisError);

    // Critical constraint verification: status MUST be FAILED, never SAFE!
    const reloaded = await repository.getRequest(created.requestId);
    expect(reloaded?.status).toBe('FAILED');
  });

  it('should throw NotFoundError if analyzing non-existent request', async () => {
    await expect(service.analyzeRequest('req_non_existent')).rejects.toThrow(NotFoundError);
  });
});
