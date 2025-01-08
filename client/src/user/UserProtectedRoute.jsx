import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import PropTypes from "prop-types";
import { checkAuth } from "../features/userAuth/authSlice";
import api from "../redux/api";
import ExtendSessionDialog from '../user/ExtendSessionDialog'
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
      const response = await api.post('/session/extend')

      if (response.data.success) {
        
        
        localStorage.setItem("accessTokenExpiry", Date.now() + response.data.accessTokenExpiresIn * 1000);
        setShowExtendSessionDialog(false); // Close the dialog
        enqueueSnackbar('Session extended successfully',{variant:'success'})

      } else {
        enqueueSnackbar('Failed to extend session',{ variant:'error'})
        
      }
    } catch (error) {
      enqueueSnackbar('Failed to extend session',{ variant:'error'})
      console.error("Error extending session:", error);
    }
  };

  useEffect(() => {
    const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");
    const TOKEN_EXPIRY_BUFFER = 2 * 60 * 1000;
    if (accessTokenExpiry) {
      const timeUntilPopup = accessTokenExpiry - Date.now() - TOKEN_EXPIRY_BUFFER;
  
      if (timeUntilPopup > 0) {
        const timer = setTimeout(() => {
          // Show the popup when token is about to expire
          setShowExtendSessionDialog(true);
        }, timeUntilPopup);
  
        return () => clearTimeout(timer); // Cleanup timeout on unmount
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
      return <Navigate to={redirectTo} />;
    }
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
  return  (<>
    {showExtendSessionDialog && (
      <ExtendSessionDialog
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />
    )}
    <Outlet />
  </>);
};

UserProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  role: PropTypes.string,
};

export default UserProtectedRoute;
