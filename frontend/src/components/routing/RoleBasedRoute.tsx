import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
}: RoleBasedRouteProps) => {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
