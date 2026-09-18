export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details !== undefined ? { details: this.details } : {}),
      },
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(409, 'CONFLICT', message, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details);
  }
}

export class AWSError extends AppError {
  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(statusCode, code, message, details);
  }
}

/**
 * Safely parses and normalizes AWS SDK errors into structured AppErrors.
 * Prevents credential leaks and hides internal AWS stack traces.
 */
export function handleAWSError(error: unknown, resourceId?: string): AWSError {
  const err = error as { name?: string; code?: string; message?: string; statusCode?: number; __type?: string };
  const name = err?.name || err?.code || err?.__type || '';
  const message = (err?.message || '').toLowerCase();

  // 1. Credentials issues
  if (
    name === 'CredentialsProviderError' ||
    name === 'NoCredentialsException' ||
    name === 'CredentialsError' ||
    message.includes('credential') ||
    message.includes('could not load credentials')
  ) {
    return new AWSError(
      401,
      'AWS_CREDENTIALS_UNAVAILABLE',
      'AWS credentials are not configured or available. Please verify environment variables or IAM role configuration.'
    );
  }

  // 2. Access Denied / IAM Permission issues
  if (
    name === 'AccessDenied' ||
    name === 'AccessDeniedException' ||
    name === 'UnauthorizedOperation' ||
    message.includes('not authorized') ||
    message.includes('access denied')
  ) {
    return new AWSError(
      403,
      'AWS_ACCESS_DENIED',
      'Access denied by AWS IAM policy. Ensure the role has read-only discovery permissions for this resource.',
      resourceId ? { resourceId } : undefined
    );
  }

  // 3. Resource Not Found
  if (
    name === 'ResourceNotFoundException' ||
    name === 'NoSuchEntity' ||
    name === 'DBInstanceNotFound' ||
    name === 'InvalidSubnetID.NotFound' ||
    name === 'InvalidInstanceID.NotFound' ||
    name === 'InvalidVpcID.NotFound' ||
    name === 'InvalidGroup.NotFound' ||
    name === 'NoSuchBucket' ||
    message.includes('not found') ||
    message.includes('does not exist')
  ) {
    return new AWSError(
      404,
      'AWS_RESOURCE_NOT_FOUND',
      `Requested AWS resource${resourceId ? ` '${resourceId}'` : ''} was not found in this region.`,
      resourceId ? { resourceId } : undefined
    );
  }

  // 4. Timeouts
  if (
    name === 'TimeoutError' ||
    name === 'AbortError' ||
    message.includes('timeout') ||
    message.includes('timed out')
  ) {
    return new AWSError(
      504,
      'AWS_API_TIMEOUT',
      'AWS API request timed out. Please check network connectivity and region reachability.',
      resourceId ? { resourceId } : undefined
    );
  }

  // 5. Service Unavailable / Throttling
  if (
    name === 'ServiceUnavailable' ||
    name === 'ServiceUnavailableException' ||
    name === 'ThrottlingException' ||
    name === 'RequestLimitExceeded' ||
    message.includes('throttl') ||
    message.includes('rate exceeded')
  ) {
    return new AWSError(
      503,
      'AWS_SERVICE_UNAVAILABLE',
      'The requested AWS service is temporarily unavailable or throttled. Please retry shortly.',
      resourceId ? { resourceId } : undefined
    );
  }

  // 6. Region / Endpoint errors
  if (
    name === 'UnknownEndpoint' ||
    name === 'EndpointConnectionError' ||
    message.includes('unknown endpoint') ||
    message.includes('could not resolve host')
  ) {
    return new AWSError(
      400,
      'AWS_INVALID_REGION',
      'The specified AWS region is invalid or the regional endpoint is unreachable.',
      resourceId ? { resourceId } : undefined
    );
  }

  // 7. General sanitized fallback
  return new AWSError(
    502,
    'AWS_API_ERROR',
    `An error occurred while communicating with the AWS API${resourceId ? ` for '${resourceId}'` : ''}.`,
    resourceId ? { resourceId } : undefined
  );
}

