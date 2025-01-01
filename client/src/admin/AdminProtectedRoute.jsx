// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const AdminProtectedRoute = ({ redirectTo = "/login", role = "admin" }) => {
  const user  = JSON.parse(sessionStorage.getItem('user'));

  if (!user) {
    // Redirect to login if no user is logged in
    return <Navigate to={redirectTo} />;
  }  

  if (user.userType !== role) {
    // If the user does not have admin role, redirect them
    return <Navigate to={ redirectTo } />;
  }

  return <Outlet />; // Render the nested routes if user is authenticated and has the correct role
};

AdminProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  role: PropTypes.string,
};

export default AdminProtectedRoute;
