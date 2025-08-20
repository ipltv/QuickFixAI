/**
 * Represents the possible user roles in the system.
 *  */
export const ROLES = {
  CLIENT_ADMIN: "client_admin",
  SYSTEM_ADMIN: "system_admin",
  STAFF: "staff",
  SUPPORT: "support",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];
