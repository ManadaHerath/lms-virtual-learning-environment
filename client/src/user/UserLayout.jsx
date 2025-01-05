import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Sidebar toggle button icons
import { FiHome, FiUsers, FiSettings, FiBarChart } from "react-icons/fi"; // Section icons
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai"; // Icons for navbar
import { Link } from "react-router-dom"; // For routing
import { useDispatch } from "react-redux";
import { logout } from "../features/userAuth/authSlice";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 text-white py-3 px-6 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40" // Replace with your logo URL
            alt="Logo"
            className="w-10 h-10"
          />
          <span className="ml-3 font-bold text-xl">YourLogo</span>
        </div>

        {/* Icons on the right */}
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="hover:text-gray-400">
            <AiOutlineShoppingCart size={24} />
          </Link>
          <Link to="/user/profile" className="hover:text-gray-400">
            <AiOutlineUser size={24} />
          </Link>
        </div>
      </nav>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-gray-800 text-white transition-all duration-300 relative`}
        >
          {/* Profile Image */}
          <div className="flex items-center justify-center py-6">
            <img
              src="https://via.placeholder.com/100" // Replace with your image URL
              alt="Profile"
              className={`rounded-full border-4 border-gray-700 ${
                isSidebarOpen ? "w-20 h-20" : "w-12 h-12"
              } transition-all duration-300`}
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                >
                  <FiHome size={24} className="mr-4" />
                  {isSidebarOpen && <span>Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/user/mycourse"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                >
                  <FiUsers size={24} className="mr-4" />
                  {isSidebarOpen && <span>My Courses</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                >
                  <FiSettings size={24} className="mr-4" />
                  {isSidebarOpen && <span>Course Catalogue</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/user/payments"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                >
                  <FiSettings size={24} className="mr-4" />
                  {isSidebarOpen && <span>Payments</span>}
                </Link>
              </li>
              <li>
                <a
                  href="/login"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <FiBarChart size={24} className="mr-4" />
                  {isSidebarOpen && <span>Logout</span>}
                </a>
              </li>
            </ul>
          </nav>

          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-0 right-0 transform translate-x-8 bg-gray-800 text-white p-1 rounded-s invert shadow-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
