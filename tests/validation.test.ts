import { describe, it, expect } from 'vitest';
import { validateCreateChangeRequest, validateRequestIdParam } from '../src/utils/validation';
import { ValidationError } from '../src/utils/errors';

describe('Validation Utility Tests', () => {
  it('should validate a correct change request payload', () => {
    const validPayload = {
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    };

    const result = validateCreateChangeRequest(validPayload);
    expect(result.action).toBe('DELETE');
    expect(result.resourceId).toBe('subnet-07');
    expect(result.resourceType).toBe('Subnet');
    expect(result.environment).toBe('PRODUCTION');
  });

  it('should throw ValidationError for invalid action', () => {
    const invalidPayload = {
      action: 'INVALID_ACTION',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    };

    expect(() => validateCreateChangeRequest(invalidPayload)).toThrow(ValidationError);
  });

  it('should validate requestId parameter correctly', () => {
    expect(validateRequestIdParam('cr-1234')).toBe('cr-1234');
    expect(() => validateRequestIdParam('')).toThrow(ValidationError);
    expect(() => validateRequestIdParam(null)).toThrow(ValidationError);
  });
});
