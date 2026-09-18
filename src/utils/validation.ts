import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { CreateChangeRequestDTO } from '../models/ChangeRequest';
import { ValidationError } from './errors';

// Schema for ChangeRequest creation
export const createChangeRequestSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE'], {
    errorMap: () => ({ message: "Action must be one of: 'CREATE', 'UPDATE', 'DELETE'" }),
  }),
  resourceId: z
    .string({ required_error: 'resourceId is required' })
    .trim()
    .min(1, { message: 'resourceId cannot be empty' }),
  resourceType: z.enum(
    [
      'VPC',
      'Subnet',
      'EC2',
      'ECS',
      'RDS',
      'Lambda',
      'S3',
      'IAM',
      'LoadBalancer',
      'SecurityGroup',
    ],
    {
      errorMap: () => ({
        message:
          "resourceType must be one of: 'VPC', 'Subnet', 'EC2', 'ECS', 'RDS', 'Lambda', 'S3', 'IAM', 'LoadBalancer', 'SecurityGroup'",
      }),
    }
  ),
  region: z
    .string({ required_error: 'region is required' })
    .trim()
    .min(1, { message: 'region cannot be empty' }),
  environment: z.enum(['DEV', 'STAGING', 'PRODUCTION'], {
    errorMap: () => ({
      message: "environment must be one of: 'DEV', 'STAGING', 'PRODUCTION'",
    }),
  }),
  details: z.record(z.unknown()).optional(),
});

export function validateCreateChangeRequest(data: unknown): CreateChangeRequestDTO {
  try {
    return createChangeRequestSchema.parse(data) as CreateChangeRequestDTO;
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Validation failed for change request payload', details);
    }
    throw error;
  }
}

export function validateCreateRequestMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    req.body = validateCreateChangeRequest(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateRequestIdParam(requestId: unknown): string {
  if (!requestId || typeof requestId !== 'string' || requestId.trim().length === 0) {
    throw new ValidationError('requestId parameter must be a non-empty string');
  }
  return requestId.trim();
}
