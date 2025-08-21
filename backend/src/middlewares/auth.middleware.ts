// middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import type { JwtPayload } from "../types/index.js";
import { UnauthorizedError } from "../utils/errors.js";

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

  // Verify the token using the secret from config.
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // If the token is valid, attach the payload to the request object.
    req.user = decoded as JwtPayload;
    next(); // Pass control to the next middleware or handler.
  } catch (err) {
    throw new UnauthorizedError("Unauthorized: Invalid or expired token");
  }
};
