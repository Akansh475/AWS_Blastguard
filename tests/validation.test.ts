import { describe, it, expect } from 'vitest';
import { ValidationService } from '../src/services/validation.service';
import { ValidationError } from '../src/models/errors.model';

describe('ValidationService', () => {
  it('should validate and normalize a valid create request DTO', () => {
    const rawDto = {
      action: 'delete',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'production',
    };

    const validated = ValidationService.validateCreateRequest(rawDto);

    expect(validated).toEqual({
      action: 'DELETE',
      resourceId: 'subnet-07',
      resourceType: 'Subnet',
      region: 'ap-south-1',
      environment: 'PRODUCTION',
    });
  });

  it('should throw ValidationError if resourceId is missing or empty', () => {
    expect(() => {
      ValidationService.validateCreateRequest({
        action: 'DELETE',
        resourceId: '   ',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      });
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid actions', () => {
    expect(() => {
      ValidationService.validateCreateRequest({
        action: 'DROP_DATABASE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      });
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid environments', () => {
    expect(() => {
      ValidationService.validateCreateRequest({
        action: 'DELETE',
        resourceId: 'subnet-07',
        resourceType: 'Subnet',
        region: 'ap-south-1',
        environment: 'LOCAL_DEV',
      });
    }).toThrow(ValidationError);
  });

  it('should accept all valid actions (CREATE, UPDATE, DELETE)', () => {
    ['create', 'UPDATE', 'Delete'].forEach((act) => {
      const result = ValidationService.validateCreateRequest({
        action: act,
        resourceId: 'res-1',
        resourceType: 'EC2',
        region: 'us-east-1',
        environment: 'DEV',
      });
      expect(result.action).toBe(act.toUpperCase());
    });
  });

  it('should accept all valid environments (DEV, STAGING, PRODUCTION)', () => {
    ['dev', 'staging', 'production'].forEach((env) => {
      const result = ValidationService.validateCreateRequest({
        action: 'CREATE',
        resourceId: 'res-1',
        resourceType: 'VPC',
        region: 'us-east-1',
        environment: env,
      });
      expect(result.environment).toBe(env.toUpperCase());
    });
  });
});
