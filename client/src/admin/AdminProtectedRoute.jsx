import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { checkAuth } from "../features/auth/authSlice";
import { useLocation } from "react-router-dom";
const AdminProtectedRoute = ({ redirectTo = "/admin/login", role = "admin" }) => {
  const dispatch = useDispatch();
  const { user, authInitialized, status } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status only if it hasn't been initialized
    if (!authInitialized) {
      dispatch(checkAuth());
    }
  }, [dispatch, authInitialized]);

  const location = useLocation();
  useEffect(() => {
    // Trigger checkAuth whenever the route changes or on mount
    try {
      dispatch(checkAuth());
    } catch (error) {
      console.log(error)
    }
    
  }, [dispatch, location]);


  // Show loading spinner or message while checking authentication
  if (!authInitialized || status === "loading") {
    dispatch(checkAuth());
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  // If the user doesn't have the required role, redirect to login
  if (user.userType !== role) {
    return <Navigate to={redirectTo} />;
  }

  // Render the child routes if authenticated and authorized
  return <Outlet />;
};

AdminProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  role: PropTypes.string,
};

export default AdminProtectedRoute;
