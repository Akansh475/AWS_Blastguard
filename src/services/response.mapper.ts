import { ChangeRequest } from '../models/changeRequest.model';
import { AnalysisResult } from '../models/analysisResult.model';

export interface RequestSummaryResponse {
  requestId: string;
  resourceId: string;
  action: string;
  resourceType: string;
  region: string;
  environment: string;
  status: string;
  riskScore?: number;
  severity?: string;
  decision?: string;
  affectedResources?: number;
  criticalServices?: number;
  externalDependencies?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDetailResponse extends RequestSummaryResponse {
  analysis?: {
    riskScore: number;
    severity: string;
    decision: string;
    affectedResources: number;
    criticalServices: number;
    externalDependencies: number;
    summary: string;
    policyViolations: Array<{
      policyId: string;
      policyName: string;
      severity: string;
      description: string;
    }>;
    securityFindings: Array<{
      category: string;
      severity: string;
      details: string;
    }>;
    dependencies: Array<{
      id: string;
      name: string;
      type: string;
      tier: string;
      direct: boolean;
    }>;
    impactGraph: {
      nodes: Array<{
        id: string;
        name: string;
        type: string;
        status: string;
        isOrigin?: boolean;
        isCritical?: boolean;
      }>;
      links: Array<{
        id: string;
        source: string;
        target: string;
        type?: string;
      }>;
    };
    analyzedAt: string;
  };
}

export class ResponseMapper {
  public static toCreateResponse(request: ChangeRequest): { requestId: string; status: string } {
    return {
      requestId: request.requestId,
      status: request.status,
    };
  }

  public static toSummaryResponse(request: ChangeRequest): RequestSummaryResponse {
    return {
      requestId: request.requestId,
      resourceId: request.resourceId,
      action: request.action,
      resourceType: request.resourceType,
      region: request.region,
      environment: request.environment,
      status: request.status,
      riskScore: request.riskScore,
      severity: request.severity,
      decision: request.decision,
      affectedResources: request.affectedResources,
      criticalServices: request.criticalServices,
      externalDependencies: request.externalDependencies,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }

  public static toDetailResponse(
    request: ChangeRequest,
    analysis?: AnalysisResult | null
  ): RequestDetailResponse {
    const summary = this.toSummaryResponse(request);

    if (!analysis) {
      return summary;
    }

    return {
      ...summary,
      riskScore: analysis.riskScore ?? summary.riskScore,
      severity: analysis.severity ?? summary.severity,
      decision: analysis.decision ?? summary.decision,
      affectedResources: analysis.affectedResources ?? summary.affectedResources,
      criticalServices: analysis.criticalServices ?? summary.criticalServices,
      externalDependencies: analysis.externalDependencies ?? summary.externalDependencies,
      analysis: {
        riskScore: analysis.riskScore,
        severity: analysis.severity,
        decision: analysis.decision,
        affectedResources: analysis.affectedResources,
        criticalServices: analysis.criticalServices,
        externalDependencies: analysis.externalDependencies,
        summary: analysis.summary,
        policyViolations: analysis.policyViolations.map((pv) => ({
          policyId: pv.policyId,
          policyName: pv.policyName,
          severity: pv.severity,
          description: pv.description,
        })),
        securityFindings: analysis.securityFindings.map((sf) => ({
          category: sf.category,
          severity: sf.severity,
          details: sf.details,
        })),
        dependencies: analysis.dependencies.map((dep) => ({
          id: dep.id,
          name: dep.name,
          type: dep.type,
          tier: dep.tier,
          direct: dep.direct,
        })),
        impactGraph: {
          nodes: analysis.impactGraph.nodes.map((node) => ({
            id: node.id,
            name: node.name,
            type: node.type,
            status: node.status,
            isOrigin: node.isOrigin,
            isCritical: node.isCritical,
          })),
          links: analysis.impactGraph.links.map((link) => ({
            id: link.id,
            source: link.source,
            target: link.target,
            type: link.type,
          })),
        },
        analyzedAt: analysis.analyzedAt,
      },
    };
  }


  public static toAnalysisResponse(analysis: AnalysisResult): Record<string, unknown> {
    return {
      requestId: analysis.requestId,
      resourceId: analysis.resourceId,
      action: analysis.action,
      status: analysis.status,
      riskScore: analysis.riskScore,
      severity: analysis.severity,
      decision: analysis.decision,
      affectedResources: analysis.affectedResources,
      criticalServices: analysis.criticalServices,
      externalDependencies: analysis.externalDependencies,
      summary: analysis.summary,
      policyViolations: analysis.policyViolations,
      securityFindings: analysis.securityFindings,
      dependencies: analysis.dependencies,
      impactGraph: analysis.impactGraph,
      analyzedAt: analysis.analyzedAt,
    };
  }

  public static toExplanationResponse(record: import('../ai/types/explanation.model').ExplanationRecord): Record<string, unknown> {
    return {
      requestId: record.requestId,
      explanation: record.explanation,
      generatedAt: record.generatedAt,
      model: record.model,
      version: record.version,
      ...(record.isFallback !== undefined ? { isFallback: record.isFallback } : {}),
    };
  }
}

