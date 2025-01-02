import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Sidebar toggle button icons
import { FiHome, FiUsers, FiSettings, FiBarChart } from "react-icons/fi"; // Section icons
import { Link } from "react-router-dom"; // For routing

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
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
                to="/admin"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <FiHome size={24} className="mr-4" />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/courses"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <FiUsers size={24} className="mr-4" />
                {isSidebarOpen && <span>Courses</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/student"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <FiSettings size={24} className="mr-4" />
                {isSidebarOpen && <span>Students</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/payment"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <FiBarChart size={24} className="mr-4" />
                {isSidebarOpen && <span>Payment</span>}
              </Link>
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
  );
};

export default AdminLayout;
