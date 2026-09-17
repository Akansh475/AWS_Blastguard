import { Action, CreateChangeRequestDTO, Environment } from '../models/changeRequest.model';
import { ValidationError } from '../models/errors.model';

const VALID_ACTIONS: Action[] = ['CREATE', 'UPDATE', 'DELETE'];
const VALID_ENVIRONMENTS: Environment[] = ['DEV', 'STAGING', 'PRODUCTION'];

export class ValidationService {
  public static validateCreateRequest(dto: unknown): {
    action: Action;
    resourceId: string;
    resourceType: string;
    region: string;
    environment: Environment;
  } {
    if (!dto || typeof dto !== 'object') {
      throw new ValidationError('Request body must be a JSON object');
    }

    const payload = dto as Partial<CreateChangeRequestDTO>;

    // 1. Validate resourceId
    if (!payload.resourceId || typeof payload.resourceId !== 'string' || !payload.resourceId.trim()) {
      throw new ValidationError('resourceId is required and must be a non-empty string');
    }

    // 2. Validate action
    if (!payload.action || typeof payload.action !== 'string') {
      throw new ValidationError('action is required (allowed: CREATE, UPDATE, DELETE)');
    }
    const normalizedAction = payload.action.trim().toUpperCase() as Action;
    if (!VALID_ACTIONS.includes(normalizedAction)) {
      throw new ValidationError(`Invalid action '${payload.action}'. Allowed actions: ${VALID_ACTIONS.join(', ')}`);
    }

    // 3. Validate resourceType
    if (!payload.resourceType || typeof payload.resourceType !== 'string' || !payload.resourceType.trim()) {
      throw new ValidationError('resourceType is required and must be a non-empty string');
    }

    // 4. Validate region
    if (!payload.region || typeof payload.region !== 'string' || !payload.region.trim()) {
      throw new ValidationError('region is required and must be a non-empty string (e.g. ap-south-1)');
    }

    // 5. Validate environment
    if (!payload.environment || typeof payload.environment !== 'string') {
      throw new ValidationError('environment is required (allowed: DEV, STAGING, PRODUCTION)');
    }
    const normalizedEnv = payload.environment.trim().toUpperCase() as Environment;
    if (!VALID_ENVIRONMENTS.includes(normalizedEnv)) {
      throw new ValidationError(`Invalid environment '${payload.environment}'. Allowed environments: ${VALID_ENVIRONMENTS.join(', ')}`);
    }

    return {
      action: normalizedAction,
      resourceId: payload.resourceId.trim(),
      resourceType: payload.resourceType.trim(),
      region: payload.region.trim(),
      environment: normalizedEnv,
    };
  }
}
