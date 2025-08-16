// middlewares/error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/errors.js";

/**
 * @description Middleware to handle errors in the application.
 * It catches any errors that occur in the request handling pipeline
 * and sends a standardized error response.
 *
 * @param err - The error object thrown by the application.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 Internal Server Error if it's not a known error type
  let statusCode = 500;
  let message = "Internal Server Error";

  // If it's one of our custom API errors, use its properties
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error
  console.error(err);

  const errorResponse: { message: string; stack?: string } = { message };

  // Only include stack trace in development for easier debugging
  if (process.env.NODE_ENV === "development" && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
