import React from "react";
import { useSelector } from "react-redux";
import { auth } from "../context/authReducer";
import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireHome = () => {
  const authis = useSelector(auth);
  const location = useLocation();
  return authis?.role === 2000 || authis?.role == "" ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireHome;
