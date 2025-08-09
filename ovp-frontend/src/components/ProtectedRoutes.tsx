import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type Role = "admin" | "inventory_manager" | "billing_clerk";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const location = useLocation();

  console.log("user ", userString);

  if (!token || !userString) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const user: { role: Role } = JSON.parse(userString);

  const hasAccess = allowedRoles.some(
    (role) => user.role.toLowerCase() === role.toLowerCase()
  );

  if (!hasAccess) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
