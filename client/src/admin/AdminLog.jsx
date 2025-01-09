import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice";
import { useNavigate } from 'react-router-dom';
import { XCircle } from "lucide-react";

const AdminLog = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  if (status === 'succeeded' && user) {
    navigate('/admin/courses');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600">Invalid email or password!</p>
              <button
                onClick={handleClearError}
                className="ml-4 rounded-full p-1 hover:bg-red-100"
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLog;