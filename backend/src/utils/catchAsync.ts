// backend/src/utils/catchAsync.ts
import type { Request, Response, NextFunction } from "express";

/**
 * @description A utility function to catch asynchronous errors in Express route handlers.
 * It wraps an async function and passes any errors to the next middleware.
 *
 * @param fn - The async function to wrap.
 * @returns A function that takes Express request, response, and next objects.
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
