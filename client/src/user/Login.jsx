import React, { useState } from "react";
import api from "../redux/api";
import { useSnackbar } from "notistack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar('Login successful', { variant: "success" });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);

        const loginResponse = { accessTokenExpiresIn: res.data.accessTokenExpiresIn };
        const accessTokenExpiryTime = Date.now() + loginResponse.accessTokenExpiresIn * 1000;
        localStorage.setItem("accessTokenExpiry", accessTokenExpiryTime);
      } else {
        enqueueSnackbar(res.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error(error.response?.data?.message || "Failed to log in");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section - Illustration/Brand */}
        <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between items-center">
          <div className="w-full">
            <img src="/lll.png" alt="logo" className="w-32 mb-8" />
            <h2 className="text-white text-4xl font-bold mb-4">Welcome back!</h2>
            <p className="text-indigo-200 text-lg">
              Continue your learning journey with our premium courses and expert instructors.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md h-64 bg-indigo-500/20 rounded-2xl backdrop-blur-sm p-6 relative">
              {/* Abstract shapes */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-lg rotate-12"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/15 rounded-xl -rotate-12 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login to Your Account</h1>
            <p className="text-gray-600">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              Log in
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;