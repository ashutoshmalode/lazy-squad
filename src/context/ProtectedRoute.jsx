import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading spinner or skeleton
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // User not authenticated, redirect to login
    return <Navigate to="/log-in" replace />;
  }

  // Check if user is trying to access correct role-based route
  const currentPath = window.location.pathname;

  if (user.role === "admin" && !currentPath.startsWith("/admin")) {
    // Admin trying to access non-admin route, redirect to admin dashboard
    return <Navigate to="/admin/admin-profile" replace />;
  }

  if (user.role === "employee" && !currentPath.startsWith("/employee")) {
    // Employee trying to access non-employee route, redirect to employee dashboard
    return <Navigate to="/employee/employee-profile" replace />;
  }

  // User is authenticated and accessing correct route
  return children;
};

export default ProtectedRoute;
