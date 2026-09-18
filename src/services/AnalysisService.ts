import { AnalysisResult } from '../models/AnalysisResult';
import { supervisorAgent, SupervisorAgent } from '../agents/SupervisorAgent';
import { changeRequestService, ChangeRequestService } from './ChangeRequestService';
import { logger } from '../utils/logger';

export class AnalysisService {
  private requestService: ChangeRequestService;
  private supervisor: SupervisorAgent;

  constructor(
    requestService?: ChangeRequestService,
    supervisorInstance?: SupervisorAgent
  ) {
    this.requestService = requestService || changeRequestService;
    this.supervisor = supervisorInstance || supervisorAgent;
  }

  /**
   * Executes the full deterministic pipeline via SupervisorAgent:
   * Resource discovery → Dependency → Topology → Security → Impact → Policy → Blast Radius → RiskEngine → DecisionEngine.
   */
  async runPlaceholderAnalysis(requestId: string): Promise<AnalysisResult> {
    logger.info(`AnalysisService: Executing full multi-agent risk analysis for request: ${requestId}`);

    const request = await this.requestService.getRequestById(requestId);

    // Execute multi-agent orchestration
    const result = await this.supervisor.orchestrateAnalysis(request);

    // Update request status based on decision
    const status =
      result.decision === 'BLOCK'
        ? 'BLOCKED'
        : result.decision === 'REVIEW'
        ? 'REVIEW'
        : 'SAFE';

    await this.requestService.updateRequestStatus(requestId, status);

    return result;
  }
}

export const analysisService = new AnalysisService();
