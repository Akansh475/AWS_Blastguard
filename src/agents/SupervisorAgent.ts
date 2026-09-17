import { AnalysisResult } from '../models/AnalysisResult';
import { ChangeRequest } from '../models/ChangeRequest';
import { decisionEngine, DecisionEngine } from '../engine/DecisionEngine';
import { riskEngine, RiskEngine } from '../engine/RiskEngine';
import { getResourceProvider, ResourceProvider } from '../providers';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { dependencyAgent, DependencyAgent } from './DependencyAgent';
import { impactAgent, ImpactAgent } from './ImpactAgent';
import { policyAgent, PolicyAgent } from './PolicyAgent';
import { securityAgent, SecurityAgent } from './SecurityAgent';
import { topologyAgent, TopologyAgent } from './TopologyAgent';

export interface ISupervisorAgent {
  name: string;
  orchestrateAnalysis(changeRequest: ChangeRequest): Promise<AnalysisResult>;
}

export class SupervisorAgent implements ISupervisorAgent {
  name = 'SupervisorAgent';

  private dependencyAgent: DependencyAgent;
  private topologyAgent: TopologyAgent;
  private securityAgent: SecurityAgent;
  private impactAgent: ImpactAgent;
  private policyAgent: PolicyAgent;
  private riskEngine: RiskEngine;
  private decisionEngine: DecisionEngine;
  private provider: ResourceProvider;

  constructor(
    dependencyAgentInstance?: DependencyAgent,
    topologyAgentInstance?: TopologyAgent,
    securityAgentInstance?: SecurityAgent,
    impactAgentInstance?: ImpactAgent,
    policyAgentInstance?: PolicyAgent,
    riskEngineInstance?: RiskEngine,
    decisionEngineInstance?: DecisionEngine,
    providerInstance?: ResourceProvider
  ) {
    this.dependencyAgent = dependencyAgentInstance || dependencyAgent;
    this.topologyAgent = topologyAgentInstance || topologyAgent;
    this.securityAgent = securityAgentInstance || securityAgent;
    this.impactAgent = impactAgentInstance || impactAgent;
    this.policyAgent = policyAgentInstance || policyAgent;
    this.riskEngine = riskEngineInstance || riskEngine;
    this.decisionEngine = decisionEngineInstance || decisionEngine;
    this.provider = providerInstance || getResourceProvider();
  }

  /**
   * Coordinates the deterministic agent pipeline:
   * Supervisor → Dependency Agent → Topology Agent → Security Agent → Impact Agent → Policy Agent → Risk Engine → Decision Engine.
   *
   * AGENT RULE: Zero fabrication. All data is verified from the infrastructure provider and deterministic engines.
   */
  async orchestrateAnalysis(changeRequest: ChangeRequest): Promise<AnalysisResult> {
    logger.info(`[${this.name}] Commencing multi-agent orchestration for request: ${changeRequest.id}`);

    const targetResource = await this.provider.getResource(changeRequest.resourceId);
    if (!targetResource) {
      throw new NotFoundError(`Resource with ID '${changeRequest.resourceId}' not found`);
    }

    // Step 1: Dependency Agent - Discovers graph dependencies
    const depResult = await this.dependencyAgent.execute(changeRequest.resourceId);

    // Step 2: Topology Agent - Constructs graph nodes and edges
    const topology = await this.topologyAgent.execute(changeRequest.resourceId);

    // Step 3: Security Agent - Detects infrastructure security implications
    const security = await this.securityAgent.execute(changeRequest.resourceId);

    // Step 4: Impact Agent - Measures quantitative impact metrics
    const impact = await this.impactAgent.execute(changeRequest.resourceId);

    // Step 5: Policy Agent - Enforces compliance guardrails
    const policy = await this.policyAgent.execute(changeRequest.resourceId, changeRequest.action);

    // Step 6: Risk Engine - Calculates deterministic numerical risk score (0–100)
    const riskResult = this.riskEngine.calculateRisk({
      resource: targetResource,
      action: changeRequest.action,
      affectedCount: impact.totalAffected,
      criticalServicesCount: impact.criticalServices,
      externalDependenciesCount: impact.externalDependencies,
      securityRisk: security.securityRisk,
      securityFindings: security.findings,
      policyViolations: policy.violations,
    });

    // Step 7: Decision Engine - Evaluates authoritative SAFE / REVIEW / BLOCK decision
    const decisionResult = this.decisionEngine.evaluateDecision({
      riskScore: riskResult.riskScore,
      policyViolations: policy.violations,
      factors: riskResult.factors,
    });

    // Retrieve affected dependencies for the data contract
    const allDeps = await this.provider.getDependencies(changeRequest.resourceId);

    // Step 8: Assemble final AnalysisResult satisfying Person 2's data contract
    const status =
      decisionResult.decision === 'BLOCK'
        ? 'BLOCKED'
        : decisionResult.decision === 'REVIEW'
        ? 'REVIEW'
        : 'SAFE';

    const recommendations: string[] = [];
    if (!policy.passed) {
      policy.violations.forEach((v) => {
        recommendations.push(`[${v.policyId}] Resolve: ${v.message}`);
      });
    }
    if (impact.externalDependencies > 0) {
      recommendations.push(
        `Coordinate maintenance windows with external partner integrations and ingress load balancers.`
      );
    }
    if (impact.criticalServices > 0) {
      recommendations.push(
        `Architectural review mandatory for ${impact.criticalServices} critical downstream compute service(s).`
      );
    }

    return {
      requestId: changeRequest.id,
      resourceId: changeRequest.resourceId,
      riskScore: decisionResult.riskScore,
      severity: decisionResult.severity,
      decision: decisionResult.decision,
      affectedResources: impact.totalAffected,
      criticalServices: impact.criticalServices,
      externalDependencies: impact.externalDependencies,
      riskBreakdown: riskResult.riskBreakdown,
      reasons: decisionResult.reasons,
      securityFindings: security.findings,
      policyViolations: policy.violations,
      dependencies: allDeps,
      topology: {
        nodes: topology.nodes,
        edges: topology.edges,
      },
      // Backwards compatibility fields
      id: `an-${changeRequest.id}`,
      status,
      riskLevel: decisionResult.severity,
      blastRadius: impact.totalAffected,
      impactGraph: topology,
      summary: `Deterministic analysis for ${changeRequest.action} on ${changeRequest.resourceType} (${changeRequest.resourceId}) in ${changeRequest.environment}. Total affected: ${impact.totalAffected}, critical services: ${impact.criticalServices}, external dependencies: ${impact.externalDependencies}. Risk score: ${decisionResult.riskScore} (${decisionResult.severity}) -> ${decisionResult.decision}.`,
      recommendations,
      analyzedAt: new Date().toISOString(),
      metadata: {
        stage: 4,
        pipeline: 'SupervisorAgent',
        productionImpact: impact.productionImpact,
        policiesPassed: policy.passed,
      },
    };
  }
}

export const supervisorAgent = new SupervisorAgent();
