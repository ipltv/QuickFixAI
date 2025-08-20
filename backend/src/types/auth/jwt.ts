import type { Role } from "../misc/roles.js";

// BEGIN: JWT types

/**
 * Represents the payload structure of a JWT token.
 */
export interface JwtPayload {
  userId: string; // User ID
  name: string; // User name
  email: string; // User email
  role: Role; // User role
  clientId: string; // Client ID
}

// END: JWT types
