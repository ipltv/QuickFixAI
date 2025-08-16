import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";
import type { Role } from "../types/types";

// Type for the RoleBasedRoute component props
interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

/**
 * @description RoleBasedRoute component checks if the user has the required roles to access a route.
 * If the user is not authenticated, it redirects to the login page.
 * If the user is authenticated but does not have the required roles, it redirects to a forbidden page.
 * If the user has the required roles, it renders the children components.
 * @param param0 - The component props containing children and allowed roles.
 * @param param0.children - The child components to render if the user has the required roles.
 * @param param0.allowedRoles - An array of roles that are allowed to access the route
 * @returns - Renders the children if the user has the required roles, otherwise redirects to the login or forbidden page.
 */

export const RoleBasedRoute = ({
  children,
  allowedRoles,
}: RoleBasedRouteProps) => {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/forbidden" replace />;
  }
  // Allow system admins to access all routes
  if (user.role === "system_admin") {
    return <>{children}</>;
  }
  // Check if the user's role is in the allowed roles
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <Navigate to="/forbidden" replace />;
};
