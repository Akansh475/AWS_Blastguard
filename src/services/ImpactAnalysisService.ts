import { Resource } from '../models/Resource';
import { dependencyAnalysisService, DependencyAnalysisService } from './DependencyAnalysisService';
import { logger } from '../utils/logger';

export interface ImpactAnalysisResult {
  resourceId: string;
  directImpact: number;
  indirectImpact: number;
  totalAffected: number;
  criticalServices: number;
  externalDependencies: number;
  productionResources: number;
  productionImpact: boolean;
  directImpactResources: Resource[];
  indirectImpactResources: Resource[];
  affectedResources: Resource[];
  criticalServiceResources: Resource[];
  externalDependencyResources: Resource[];
  productionImpactResources: Resource[];
}

export class ImpactAnalysisService {
  private dependencyService: DependencyAnalysisService;

  constructor(dependencyService?: DependencyAnalysisService) {
    this.dependencyService = dependencyService || dependencyAnalysisService;
  }

  /**
   * Evaluates the topological impact of modifying or deleting a resource.
   * Calculates directImpact, indirectImpact, totalAffected, criticalServices,
   * externalDependencies, and productionResources strictly from graph traversal.
   */
  async analyzeImpact(resourceId: string): Promise<ImpactAnalysisResult> {
    logger.info(`ImpactAnalysisService: Evaluating impact for ${resourceId}`);

    const analysis = await this.dependencyService.analyzeDependencies(resourceId);

    const directImpact = analysis.directDependencies.length;
    const indirectImpact = analysis.indirectDependencies.length;
    const totalAffected = analysis.totalAffectedResources.length;
    const criticalServices = analysis.criticalServices.length;
    const externalDependencies = analysis.externalDependencies.length;

    const productionImpactResources = analysis.totalAffectedResources.filter(
      (r) => r.environment === 'PRODUCTION'
    );
    const productionResources = productionImpactResources.length;
    const productionImpact = productionResources > 0;

    return {
      resourceId,
      directImpact,
      indirectImpact,
      totalAffected,
      criticalServices,
      externalDependencies,
      productionResources,
      productionImpact,
      directImpactResources: analysis.directDependencies,
      indirectImpactResources: analysis.indirectDependencies,
      affectedResources: analysis.totalAffectedResources,
      criticalServiceResources: analysis.criticalServices,
      externalDependencyResources: analysis.externalDependencies,
      productionImpactResources,
    };
  }
}

export const impactAnalysisService = new ImpactAnalysisService();
