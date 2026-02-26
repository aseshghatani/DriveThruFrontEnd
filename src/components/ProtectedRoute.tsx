// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not authorized → redirect to login
    return <Navigate to="/send-otp" replace />;
  }

  // Authorized → show the page
  return <>{children}</>;
};

export default ProtectedRoute;
