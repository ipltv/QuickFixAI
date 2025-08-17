/**
 * @fileoverview This file contains the RBAC (Role-Based Access Control) middleware.
 * It checks if a user has the necessary permissions to access a specific resource.
 * The permissions are defined in the `PERMISSIONS` configuration.
 */

import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { PERMISSIONS } from "../config/permissions.js";
import { type Role } from "../types/types.js";

/**
 * @description RBAC middleware factory.
 * It generates a middleware handler that checks if a user's role has permission
 * to perform an action on a specific resource.
 * @param resource - The name of the resource being accessed (e.g., 'users', 'clients' 'tickets').
 * @returns An Express middleware function.
 */
export const checkPermission = (resource: keyof typeof PERMISSIONS) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Get the authenticated user's role from the request object.
    const userRole = req.user?.role as Role;

    if (!userRole) {
      throw new UnauthorizedError(
        "Authentication required. No user role found."
      );
    }

    // 2. Get the required permissions for the requested resource.
    const resourcePermissions = PERMISSIONS[resource];
    if (!resourcePermissions) {
      console.error(
        `RBAC Error: No permissions defined for resource: ${resource}`
      );
      throw new ForbiddenError(
        "You do not have permission to access this resource."
      );
    }

    // 3. Get the list of methods allowed for the user's role.
    const allowedMethods = resourcePermissions[userRole];
    if (!allowedMethods) {
      // If the role is not listed for this resource, they have no permissions.
      throw new ForbiddenError(
        "You do not have permission to access this resource."
      );
    }

    // 4. Check if the user's role is allowed to use the current HTTP method.
    if (allowedMethods.includes(req.method)) {
      // 5. Permission granted, proceed to the next middleware or controller.
      return next();
    }

    // If the method is not in the allowed list, deny access.
    throw new ForbiddenError(
      "You do not have permission to perform this action."
    );
  };
};
