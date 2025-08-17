/**
 * @fileoverview This file centralizes the role-based access control (RBAC) permissions.
 * It defines which roles have access to specific actions (e.g., creating, reading, updating, deleting users).
 */

import { type Role } from "../types/types.js";

// Define a type for our permissions mapping.
// The key is the resource (e.g., 'users'), and the value is an object
// where keys are roles and values are arrays of allowed HTTP methods.
type PermissionsMap = {
  [resource: string]: {
    [role in Role]?: string[];
  };
};

// Define the permissions for application.
export const PERMISSIONS: PermissionsMap = {
  users: {
    // System admins can perform any action on users.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins can view and create users, but not delete or modify all of them.
    // (More granular logic can be added later, e.g., can only manage users within their own client).
    client_admin: ["GET", "POST", "PUT"],
    // Support staff can view users.
    support: ["GET"],
    // Regular staff have no access to the user management endpoints directly.
    staff: [],
  },
  clients: {
    // System admins can perform any action on clients.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins, supporta and regular staff can view clients.
    client_admin: ["GET"],
    support: ["GET"],
    staff: ["GET"],
  },
  // tickets: {
  //   system_admin: ["GET", "POST", "PUT", "DELETE"],
  //   client_admin: ["GET", "POST", "PUT"],
  //   support: ["GET", "POST", "PUT"],
  //   staff: ["GET", "POST"],
  // }
  // knowledge_base: {
  //   system_admin: ["GET", "POST", "PUT", "DELETE"],
  //   client_admin: ["GET", "POST", "PUT", "DELETE"],
  //   support: ["GET", "POST", "PUT"],
  //   staff: ["GET"],
};
