// middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";
import { UnauthorizedError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/verifyAccessToken.js";

/**
 * @description Middleware to authenticate requests using JWT.
 * It checks for the presence of a valid JWT in the Authorization header.
 * If valid, it attaches the user information to the request object.
 * If invalid or missing, it responds with a 401 Unauthorized status.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check for the header and its 'Bearer ' format.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized: No token provided");
  }

  // Extract the token from the header.
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Unauthorized: Invalid token format");
  }

  const decoded = verifyAccessToken(token);
  req.user = decoded as JwtPayload;
  next();
};
