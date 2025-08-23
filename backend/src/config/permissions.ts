/**
 * @fileoverview This file centralizes the role-based access control (RBAC) permissions.
 * It defines which roles have access to specific actions (e.g., creating, reading, updating, deleting users).
 */

import { type Role } from "../types/index.js";

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
    client_admin: ["GET", "POST", "PUT", "DELETE"],
    // Support staff can view users.
    support: ["GET"],
    // Staff can view users.
    staff: ["GET"],
  },
  clients: {
    // System admins can perform any action on clients.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins, supporta and regular staff can view clients.
    client_admin: ["GET"],
    support: ["GET"],
    staff: ["GET"],
  },
  knowledge_articles: {
    // System admins can perform any action on knowledge articles.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins can perform any action on knowledge articles within their own client.
    client_admin: ["GET", "POST", "PUT", "DELETE"],
    // Support staff can view, create, and update knowledge articles, but not delete them.
    support: ["GET", "POST", "PUT"],
    // Staff can view knowledge articles.
    staff: ["GET"],
  },
  tickets: {
    // System admins can perform any action on tickets.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins can perform any action on tickets within their own client.
    client_admin: ["GET", "POST", "PUT", "DELETE"],
    // Support staff can view and update tickets, but not delete them.
    support: ["GET", "POST", "PUT"], // POST is for adding messages
    // Staff can view tickets and create new ones.
    staff: ["GET", "POST", "PUT"], // PUT is for simple status changes by the creator
  },
  equipment: {
    // System admins can perform any action on equipment.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins can perform any action on equipment within their own client.
    client_admin: ["GET", "POST", "PUT", "DELETE"],
    // Support staff can only view equipment.
    support: ["GET"],
    // Support staff can only view equipment.
    staff: ["GET"],
  },
  ticket_categories: {
    // System admins can perform any action on ticket categories.
    system_admin: ["GET", "POST", "PUT", "DELETE"],
    // Client admins can perform any action on ticket categories within their own client.
    client_admin: ["GET", "POST", "PUT", "DELETE"],
    // Support staff can perform any action on ticket categories within their own client.
    support: ["GET", "POST", "PUT", "DELETE"],
    // Staff can only view ticket categories.
    staff: ["GET"],
  },
};
