// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/send-otp",
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not authorized → redirect to login
    return <Navigate to={redirectTo} replace />;
  }

  // Authorized → show the page
  return <>{children}</>;
};

export default ProtectedRoute;
