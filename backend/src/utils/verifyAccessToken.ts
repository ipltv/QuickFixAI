import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import type { JwtPayload } from "../types/index.js";
import { UnauthorizedError } from "./errors.js";

/**
 * Verifies an access JWT and returns its payload.
 * @throws {UnauthorizedError} when the token is invalid or expired.
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedError("Unauthorized: Invalid or expired token");
  }
}
