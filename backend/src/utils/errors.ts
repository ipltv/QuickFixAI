// backend/src/utils/errors.ts
/**
 * @description Custom error class for API errors.
 * This class extends the built-in Error class to include
 * an HTTP status code, allowing for more precise error handling
 * in API responses.
 */
export class APIError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * @description Custom error class for Not Found errors.
 * This class extends APIError to represent a 404 Not Found error.
 */
export class NotFoundError extends APIError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * @description Custom error class for Bad Request errors.
 * This class extends APIError to represent a 400 Bad Request error.
 */
export class BadRequestError extends APIError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

/**
 * @description Custom error class for Unauthorized errors.
 * This class extends APIError to represent a 401 Unauthorized error.
 */
export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * @description Custom error class for Conflict errors.
 * This class extends APIError to represent a 409 Conflict error.
 */
export class ConflictError extends APIError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/**
 * @description Custom error class for Forbidden errors.
 * This class extends APIError to represent a 403 Forbidden error.
 */
export class ForbiddenError extends APIError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
