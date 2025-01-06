import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  Home,
  Layers,
  Book,
  CreditCard,
  LogOut,
  ChevronRight,
  Settings,
  User,
} from "lucide-react";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Icons for navbar
import { useDispatch } from "react-redux";
import { logout } from "../features/userAuth/authSlice";
import { Link } from "react-router-dom";
import api from "../redux/api";

const UserLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0); // Example notification count

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        if (response.status !== 200) throw new Error("Failed to fetch profile");
        setImageFile(response.data.user.image_url); // Set image URL directly here
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
    const list = JSON.parse(localStorage.getItem("cart"));
    setCartItemCount(list.length);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Premium Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          {/* Brand and Search */}
          <div className="flex items-center flex-1 gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="lpedu.png" // Replace with your logo URL
                alt="Logo"
                className="w-28"
              />
            </div>

            {/* Enhanced Search Bar
            <div className="max-w-xl flex-1 relative">
              <div
                className={`
                relative rounded-lg transition-all duration-200 
                ${
                  searchFocused
                    ? "ring-2 ring-blue-500 bg-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }
              `}
              >
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search courses, topics, instructors..."
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-sm"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div> */}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Link to="/cart" className="hover:text-gray-400">
                  <AiOutlineShoppingCart size={24} />
                </Link>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile */}
            <Link
              to="/user/profile"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                {imageFile ? (
                  <img
                    src={imageFile}
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Premium Sidebar */}
        <aside
          className={`
      ${isSidebarOpen ? "lg:w-64 w-20" : "w-20"}
      bg-white border-r border-gray-100 transition-all duration-300
      flex flex-col
    `}
        >
          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { icon: Home, label: "Dashboard", path: "/dashboard" },
                { icon: Layers, label: "My Courses", path: "/user/mycourse" },
                { icon: Book, label: "Course Catalog", path: "/" },
                { icon: CreditCard, label: "Payments", path: "/user/payments" },
                { icon: Settings, label: "Settings", path: "/settings" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-700 hover:bg-gray-50 hover:text-blue-600
                group transition-colors relative
              `}
                  >
                    <item.icon
                      size={20}
                      className="group-hover:text-blue-600"
                    />
                    {isSidebarOpen && (
                      <div className="hidden lg:block">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <ChevronRight
                          size={16}
                          className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    {/* Tooltip for small screens */}
                    <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 group transition-colors relative"
            >
              <LogOut size={20} className="group-hover:text-red-600" />
              {isSidebarOpen && (
                <span className="hidden lg:block text-sm font-medium">
                  Logout
                </span>
              )}
              {/* Tooltip for small screens */}
              <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          </div>

          {/* Toggle Button */}
          <Link
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-6 p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 shadow-sm"
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </Link>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
