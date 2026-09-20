import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { IRequestRepository } from './request.repository';
import { ChangeRequest, RequestFilterOptions, RequestStatus } from '../models/changeRequest.model';
import { AnalysisResult } from '../models/analysisResult.model';
import { config } from '../config';
import { logger } from '../utils/logger';

import { ExplanationRecord, ExplanationResult } from '../ai/types/explanation.model';

export class DynamoDBRequestRepository implements IRequestRepository {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string = config.dynamoDbTableName || 'BlastGuardRequests'
  ) {}

  private mapItemToChangeRequest(item: Record<string, unknown>): ChangeRequest {
    return {
      requestId: item.requestId as string,
      action: item.action as ChangeRequest['action'],
      resourceId: item.resourceId as string,
      resourceType: item.resourceType as string,
      region: item.region as string,
      environment: item.environment as ChangeRequest['environment'],
      status: item.status as RequestStatus,
      riskScore: item.riskScore !== undefined ? Number(item.riskScore) : undefined,
      severity: item.severity as ChangeRequest['severity'],
      decision: item.decision as ChangeRequest['decision'],
      affectedResources: item.affectedResources !== undefined ? Number(item.affectedResources) : undefined,
      criticalServices: item.criticalServices !== undefined ? Number(item.criticalServices) : undefined,
      externalDependencies: item.externalDependencies !== undefined ? Number(item.externalDependencies) : undefined,
      createdAt: (item.createdAt as string) || new Date().toISOString(),
      updatedAt: (item.updatedAt as string) || new Date().toISOString(),
      analyzedAt: item.analyzedAt as string | undefined,
      analysisResult: item.analysisResult as AnalysisResult | undefined,
      aiExplanation: item.aiExplanation as ExplanationResult | undefined,
      aiExplanationGeneratedAt: item.aiExplanationGeneratedAt as string | undefined,
      aiModel: item.aiModel as string | undefined,
      aiExplanationVersion: item.aiExplanationVersion as string | undefined,
    };
  }


  async createRequest(request: ChangeRequest): Promise<ChangeRequest> {
    const item: Record<string, unknown> = {
      requestId: request.requestId,
      action: request.action,
      resourceId: request.resourceId,
      resourceType: request.resourceType,
      region: request.region,
      environment: request.environment,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };

    if (request.riskScore !== undefined) item.riskScore = request.riskScore;
    if (request.severity) item.severity = request.severity;
    if (request.decision) item.decision = request.decision;
    if (request.affectedResources !== undefined) item.affectedResources = request.affectedResources;
    if (request.criticalServices !== undefined) item.criticalServices = request.criticalServices;
    if (request.externalDependencies !== undefined) item.externalDependencies = request.externalDependencies;
    if (request.analyzedAt) item.analyzedAt = request.analyzedAt;
    if (request.analysisResult) item.analysisResult = request.analysisResult;

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    logger.debug(`DynamoDB: Created request item`, { requestId: request.requestId, tableName: this.tableName });
    return { ...request };
  }

  async getRequest(requestId: string): Promise<ChangeRequest | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { requestId },
      })
    );

    if (!response.Item) {
      return null;
    }

    return this.mapItemToChangeRequest(response.Item);
  }

  async listRequests(filter?: RequestFilterOptions): Promise<ChangeRequest[]> {
    let scanParams: {
      TableName: string;
      FilterExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    } = {
      TableName: this.tableName,
    };

    if (filter?.status) {
      scanParams = {
        TableName: this.tableName,
        FilterExpression: '#st = :status',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: { ':status': filter.status },
      };
    }

    const response = await this.docClient.send(new ScanCommand(scanParams));
    const items = (response.Items || []).map((item) => this.mapItemToChangeRequest(item));

    // Sort descending by creation date
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    riskScore?: number
  ): Promise<ChangeRequest | null> {
    const now = new Date().toISOString();

    const exprAttrNames: Record<string, string> = {
      '#st': 'status',
      '#updatedAt': 'updatedAt',
    };

    const exprAttrValues: Record<string, unknown> = {
      ':status': status,
      ':updatedAt': now,
    };

    let updateExpr = 'SET #st = :status, #updatedAt = :updatedAt';

    if (riskScore !== undefined) {
      updateExpr += ', #riskScore = :riskScore';
      exprAttrNames['#riskScore'] = 'riskScore';
      exprAttrValues[':riskScore'] = riskScore;
    }

    const response = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { requestId },
        UpdateExpression: updateExpr,
        ExpressionAttributeNames: exprAttrNames,
        ExpressionAttributeValues: exprAttrValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!response.Attributes) {
      return null;
    }

    return this.mapItemToChangeRequest(response.Attributes);
  }

  async saveAnalysisResult(result: AnalysisResult): Promise<AnalysisResult> {
    const now = new Date().toISOString();

    await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { requestId: result.requestId },
        UpdateExpression:
          'SET #analysisResult = :result, #riskScore = :riskScore, #severity = :severity, #decision = :decision, #affectedResources = :affectedResources, #criticalServices = :criticalServices, #externalDependencies = :externalDependencies, #analyzedAt = :analyzedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#analysisResult': 'analysisResult',
          '#riskScore': 'riskScore',
          '#severity': 'severity',
          '#decision': 'decision',
          '#affectedResources': 'affectedResources',
          '#criticalServices': 'criticalServices',
          '#externalDependencies': 'externalDependencies',
          '#analyzedAt': 'analyzedAt',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':result': result,
          ':riskScore': result.riskScore,
          ':severity': result.severity,
          ':decision': result.decision,
          ':affectedResources': result.affectedResources,
          ':criticalServices': result.criticalServices,
          ':externalDependencies': result.externalDependencies,
          ':analyzedAt': result.analyzedAt,
          ':updatedAt': now,
        },
      })
    );

    logger.debug(`DynamoDB: Saved analysis result`, { requestId: result.requestId });
    return { ...result };
  }

  async getAnalysisResult(requestId: string): Promise<AnalysisResult | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { requestId },
        ProjectionExpression: 'analysisResult',
      })
    );

    if (!response.Item || !response.Item.analysisResult) {
      return null;
    }

    return response.Item.analysisResult as AnalysisResult;
  }

  async saveExplanation(requestId: string, record: ExplanationRecord): Promise<void> {
    const now = new Date().toISOString();

    await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { requestId },
        UpdateExpression:
          'SET #aiExplanation = :aiExplanation, #aiExplanationGeneratedAt = :aiGeneratedAt, #aiModel = :aiModel, #aiExplanationVersion = :aiVersion, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#aiExplanation': 'aiExplanation',
          '#aiExplanationGeneratedAt': 'aiExplanationGeneratedAt',
          '#aiModel': 'aiModel',
          '#aiExplanationVersion': 'aiExplanationVersion',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':aiExplanation': record.explanation,
          ':aiGeneratedAt': record.generatedAt,
          ':aiModel': record.model,
          ':aiVersion': record.version,
          ':updatedAt': now,
        },
      })
    );

    logger.debug(`DynamoDB: Saved AI explanation for ${requestId}`);
  }

  async getExplanation(requestId: string): Promise<ExplanationRecord | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { requestId },
        ProjectionExpression: 'requestId, aiExplanation, aiExplanationGeneratedAt, aiModel, aiExplanationVersion, updatedAt',
      })
    );

    if (!response.Item || !response.Item.aiExplanation) {
      return null;
    }

    return {
      requestId: (response.Item.requestId as string) || requestId,
      explanation: response.Item.aiExplanation as ExplanationResult,
      generatedAt: (response.Item.aiExplanationGeneratedAt as string) || (response.Item.updatedAt as string),
      model: (response.Item.aiModel as string) || config.bedrockModelId || 'mock-bedrock-v1',
      version: (response.Item.aiExplanationVersion as string) || '1.0.0',
    };
  }

  async clearAll(): Promise<void> {
    const all = await this.listRequests();
    for (const req of all) {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { requestId: req.requestId },
        })
      );
    }
  }
}

