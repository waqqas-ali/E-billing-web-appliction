import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

function Protected() {
  const location = useLocation();
  const ebilling = JSON.parse(localStorage.getItem("eBilling"));

  if (!ebilling || !ebilling.accessToken) {
    // Not logged in → go back to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default Protected;
