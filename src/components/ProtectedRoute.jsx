import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Prevent browser back/forward navigation
    const handlePopState = (event) => {
      if (user) {
        // If user is logged in, prevent any navigation away from the app
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Push current state to prevent back navigation to login
    if (user) {
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [user]);

  // Check if user is trying to access wrong dashboard
  const checkRouteAccess = () => {
    if (!user) return false;

    const currentPath = location.pathname;

    // Admin should only access /admin/* routes
    if (user.role === "admin" && !currentPath.startsWith("/admin")) {
      return false;
    }

    // Employee should only access /employee/* routes
    if (user.role === "employee" && !currentPath.startsWith("/employee")) {
      return false;
    }

    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/log-in" replace />;
  }

  // Redirect to correct dashboard if user tries to access wrong route
  if (!checkRouteAccess()) {
    if (user.role === "admin") {
      return <Navigate to="/admin/admin-profile" replace />;
    } else {
      return <Navigate to="/employee/employee-profile" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
