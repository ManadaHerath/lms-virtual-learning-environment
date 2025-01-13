import React, { useState } from "react";
import { Menu, ChevronLeft, Home, Users, Book, LogOut, PlusSquare } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Note: Consider using a more controlled way to handle logout
    // Rather than directly reloading the window
    dispatch(logout());
    
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }) => {
    const Component = to ? "a" : "button"; // Simplified for demo - use your router's Link component
    return (
      <Component
        href={to}
        onClick={onClick}
        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group relative w-full"
      >
        <div className="min-w-[24px] flex items-center justify-center">
          <Icon 
            className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors"
            strokeWidth={1.5}
          />
        </div>
        <span 
          className={`ml-4 text-sm font-medium group-hover:text-blue-400 transition-all duration-300 ${
            !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          {children}
        </span>
      </Component>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 border-b border-gray-700/50">
          <div 
            className={`mt-4 text-center transition-all duration-300 ${
              !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            <h2 className="text-lg font-medium text-gray-200">Admin User</h2>
            <p className="text-sm text-gray-400">administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            <NavLink to="/admin/courses" icon={Book}>
              Courses
            </NavLink>
            <NavLink to="/admin/student" icon={Users}>
              Students
            </NavLink>
            <NavLink to="/admin/create-quiz" icon={PlusSquare}>
              Quiz
            </NavLink>
          </div>
          
          {/* Logout Section */}
          <div className="absolute bottom-4 w-full left-0 px-3">
            <NavLink icon={LogOut} onClick={handleLogout}>
              Logout
            </NavLink>
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-gray-700 text-gray-300 p-1.5 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:ring-offset-gray-800"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;