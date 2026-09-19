export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'INVALID_REQUEST');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'REQUEST_NOT_FOUND');
  }
}

export class AnalysisError extends AppError {
  constructor(message: string) {
    super(message, 500, 'ANALYSIS_FAILED');
  }
}

export class AnalysisRequiredError extends AppError {
  constructor(message = 'Change request must be analyzed before generating an explanation') {
    super(message, 409, 'ANALYSIS_REQUIRED');
  }
}

export class ExplanationNotFoundError extends AppError {
  constructor(message = 'AI explanation not found for this change request') {
    super(message, 404, 'EXPLANATION_NOT_FOUND');
  }
}

