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
  ChevronLeft,
  Settings,
  User,
} from "lucide-react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { logout } from "../features/userAuth/authSlice";
import { Link } from "react-router-dom";
import api from "../redux/api";

const UserLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        if (response.status !== 200) throw new Error("Failed to fetch profile");
        setImageFile(response.data.user.image_url);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
    const list = JSON.parse(localStorage.getItem("cart"));
    setCartItemCount(list?.length || 0);
  }, []);

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Layers, label: "My Courses", path: "/user/mycourse" },
    { icon: Book, label: "Course Catalog", path: "/" },
    { icon: CreditCard, label: "Payments", path: "/user/payments" },
    { icon: Settings, label: "Analyse", path: "/user/analyse" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center">
              <img src="lpedu.png" alt="Logo" className="w-20 sm:w-28" />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
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

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            ${isSidebarOpen ? "lg:w-64 w-64" : "lg:w-20 w-64"}
            fixed top-[57px] left-0 bottom-0
            bg-white border-r border-gray-100
            transition-all duration-300
            flex flex-col
            z-40
          `}
        >
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 group transition-colors relative"
                  >
                    <item.icon
                      size={20}
                      className="group-hover:text-blue-600 flex-shrink-0"
                    />
                    <span
                      className={`text-sm font-medium ${
                        !isSidebarOpen && "lg:hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 group transition-colors"
            >
              <LogOut
                size={20}
                className="group-hover:text-red-600 flex-shrink-0"
              />
              <span
                className={`text-sm font-medium ${
                  !isSidebarOpen && "lg:hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block absolute -right-3 top-4 p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
          } transition-all duration-300`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-center bg-white border-t border-gray-100 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-center lg:justify-end transition-all duration-300">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">
              © {new Date().getFullYear()} Scope
            </span>
            <img
              src="scope.png"
              alt="Scope Logo"
              className="w-3 sm:w-4 h-auto"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
