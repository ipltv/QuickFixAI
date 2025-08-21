// --- Object Literal as an Enum for Roles ---

// Define the possible user roles in the application
export const ROLES = {
  STAFF: "staff",
  SUPPORT: "support",
  CLIENT_ADMIN: "client_admin",
  SYSTEM_ADMIN: "system_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
