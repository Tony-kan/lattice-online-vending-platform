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
    return <Navigate to="/login" replace />;
  }

  const user: { role: Role } = JSON.parse(userString);

  if (!allowedRoles.includes(user.role)) {
    // Authenticated but not authorized, redirect to Modules display page
    // A more user-friendly approach might show an "Access Denied" page
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: location.pathname, requiredRoles: allowedRoles }}
      />
    );
  }

  // Authenticated and authorized, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;
