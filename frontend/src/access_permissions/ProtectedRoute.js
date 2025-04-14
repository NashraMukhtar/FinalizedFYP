import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const ProtectedRoute = ({ adminOnly = false, userOnly = false }) => {
  const { token, isUserAdmin, loading  } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no token is present, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true, check for admin privileges
  if (adminOnly && !isUserAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If userOnly is true, prevent admins from accessing
  if (userOnly && isUserAdmin) {
    return <Navigate to="/admin-panel" replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
