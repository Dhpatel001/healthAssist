import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserPrivateRoute = ({ allowedRole }) => {
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage

  if (!userId) { 
    return <Navigate to="/login" replace />; // Redirect to login if user is not authenticated
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to home
  }

  return <Outlet />; // Allow access to child routes
};

export default UserPrivateRoute;
