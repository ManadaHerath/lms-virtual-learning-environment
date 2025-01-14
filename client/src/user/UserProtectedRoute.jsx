import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import PropTypes from "prop-types";
import { checkAuth, logout } from "../features/userAuth/authSlice";
import api from "../redux/api";
import ExtendSessionDialog from "../user/ExtendSessionDialog";
import { useSnackbar } from "notistack";

const UserProtectedRoute = ({ redirectTo = "/login", role = "student" }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user, authInitialized, status, error } = useSelector(
    (state) => state.studentAuth
  );
  const [showExtendSessionDialog, setShowExtendSessionDialog] = useState(false);

  const handleLogout = () => {
    // Clear tokens and redirect to login page
    setShowExtendSessionDialog(false);
  };

  const handleExtendSession = async () => {
    try {
      const response = await api.post("/session/extend");

      if (response.data.success) {
        localStorage.setItem(
          "accessTokenExpiry",
          Date.now() + response.data.accessTokenExpiresIn * 1000
        );
        setShowExtendSessionDialog(false); // Close the dialog
        enqueueSnackbar("Session extended successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to extend session", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to extend session", { variant: "error" });
      console.error("Error extending session:", error);
    }
  };

  useEffect(() => {
    // Set timeout for session expiry when user is logged in
    if (user) {
      // Set timeout for 15 minutes (900000 ms) - match this with your cookie expiry
      const sessionTimeout = setTimeout(() => {
        dispatch(logout());
        enqueueSnackbar("Session expired. Please login again.", { 
          variant: "info" 
        });
        <Navigate to={redirectTo} />;
      }, 43200000); // 15 minutes

      // Cleanup timeout on unmount or when user changes
      return () => clearTimeout(sessionTimeout);
    }
  }, [user, dispatch, redirectTo, enqueueSnackbar]);

  useEffect(() => {
    const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");
    
    const TOKEN_EXPIRY_BUFFER = 2 * 60 * 1000;
    if (accessTokenExpiry) {
      const timeUntilPopup = 12*60*1000 - Date.now() - TOKEN_EXPIRY_BUFFER;
      if (timeUntilPopup > 0) {
        console.log(timeUntilPopup);
        
        const timer = setTimeout(() => {
          
          // Show the popup when token is about to expire
          
          setShowExtendSessionDialog(true);
        }, timeUntilPopup);
        
        //return () => clearTimeout(timer); // Cleanup timeout on unmount
      }
    }
  }, []);

  useEffect(() => {
    // Check auth status only if it hasn't been initialized
    if (!authInitialized) {
      dispatch(checkAuth());
    }
  }, [dispatch, authInitialized]);

  // Show loading spinner or message while checking authentication
  if (!authInitialized || status === "loading") {
    dispatch(checkAuth());
    return <div>Loading...</div>;
  }
  if (error) {
    if (error.status === 403) {
      console.log("403 error detected, navigating to login.");
    return <Navigate to={redirectTo} replace />;
    }
  }
  

  // If no user is logged in, redirect to the login page
  if (!user) {
    enqueueSnackbar('Session expired',{variant:'warning'})
    return <Navigate to={redirectTo} />;
  }

  // If the user doesn't have the required role, redirect to login
  if (user.userType !== role) {
    enqueueSnackbar('Session expired',{variant:'warning'})
    return <Navigate to={redirectTo} />;
  }

  // Render the child routes if authenticated and authorized
  return (
    <>
      {showExtendSessionDialog && (
        <ExtendSessionDialog
          onExtendSession={handleExtendSession}
          onLogout={handleLogout}
        />
      )}
      <Outlet />
    </>
  );
};

UserProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  role: PropTypes.string,
};

export default UserProtectedRoute;
