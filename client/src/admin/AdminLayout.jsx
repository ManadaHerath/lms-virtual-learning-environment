import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { FiHome, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import { IoCreate } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }) => {
    const Component = to ? Link : 'button';
    return (
      <Component
        to={to}
        onClick={onClick}
        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group relative"
      >
        <Icon className="w-6 h-6 mr-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
        {isSidebarOpen && (
          <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">
            {children}
          </span>
        )}
      </Component>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 relative flex flex-col`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 border-b border-gray-700/50">
          <div className="relative">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className={`rounded-full ${
                isSidebarOpen ? "w-20 h-20" : "w-12 h-12"
              } transition-all duration-300 ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-800`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-800"></div>
          </div>
          {isSidebarOpen && (
            <div className="mt-4 text-center">
              <h2 className="text-lg font-medium text-gray-200">Admin User</h2>
              <p className="text-sm text-gray-400">administrator</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <NavLink to="/admin" icon={FiHome}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/courses" icon={FiUsers}>
              Courses
            </NavLink>
            <NavLink to="/admin/student" icon={FiSettings}>
              Students
            </NavLink>
            <NavLink to="/admin/create-quiz" icon={IoCreate}>
              Quiz
            </NavLink>
          </div>
          
          {/* Logout Section */}
          <div className="absolute bottom-4 w-full left-0 px-3">
            <NavLink icon={FiLogOut} onClick={handleLogout}>
              Logout
            </NavLink>
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 transform transition-transform bg-gray-700 text-gray-300 p-1.5 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:ring-offset-gray-800"
        >
          {isSidebarOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;