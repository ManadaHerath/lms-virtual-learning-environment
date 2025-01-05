import React, { useState } from "react";
import api from "../redux/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/user/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        window.location.href = "/dashboard"; // Change to your desired route
      } else {
        prompt(res.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error(
        error.response?.data?.message || "Failed to log in"
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-white p-4">
      {/* Left Section with Background Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center rounded-tl-lg rounded-tr-lg rounded-br-[200px]"
        style={{
          backgroundImage: "url('/image.png')",
          margin: "0.01px",
        }}
      ></div>

      {/* Right Section for Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome</h1>
            <h2 className="text-3xl font-semibold text-gray-600 mt-2">
              to Physics with Lasa
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-red-500 hover:text-red-600">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
