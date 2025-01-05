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
      throw new Error(error.response?.data?.message || "Failed to log in");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 p-4 relative overflow-hidden">
      {/* Floating stars background */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Left Section with Solar System */}
      <div className="hidden md:flex w-3/5 bg-cover bg-center rounded-tl-lg rounded-tr-lg rounded-br-[200px] relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          {/* Jupiter - Large planet with bands */}
          <div className="absolute w-72 h-72 rounded-full bottom-20 -right-20 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500">
              {/* Jupiter's bands */}
              <div className="absolute w-full h-8 bg-orange-600/40 top-1/4 -rotate-6"></div>
              <div className="absolute w-full h-6 bg-orange-200/30 top-1/2 rotate-6"></div>
              <div className="absolute w-full h-10 bg-orange-700/40 bottom-1/4 -rotate-3"></div>
              {/* Great Red Spot */}
              <div className="absolute w-16 h-10 rounded-full bg-red-500/60 top-1/3 right-12 rotate-12"></div>
            </div>
          </div>

          {/* Saturn with detailed rings */}
          <div className="absolute w-48 h-48 top-10 left-20 animate-float-slow">
            {/* Saturn's body */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400">
              {/* Saturn's surface bands */}
              <div className="absolute w-full h-3 bg-yellow-600/30 top-1/4 -rotate-12"></div>
              <div className="absolute w-full h-4 bg-yellow-100/30 bottom-1/3"></div>
            </div>
            {/* Saturn's rings */}
            <div
              className="absolute w-64 h-2 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 
                    top-1/2 -left-8 -rotate-12 rounded-full shadow-lg"
            ></div>
            <div
              className="absolute w-64 h-1 bg-gradient-to-r from-yellow-300 via-transparent to-yellow-300 
                    top-1/2 -left-8 -rotate-12 rounded-full -translate-y-1"
            ></div>
            <div
              className="absolute w-64 h-1 bg-gradient-to-r from-yellow-300 via-transparent to-yellow-300 
                    top-1/2 -left-8 -rotate-12 rounded-full translate-y-1"
            ></div>
          </div>

          {/* Mars - Small reddish planet */}
          <div
            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 
                    top-40 right-40 animate-orbit-small"
          >
            {/* Mars' surface details */}
            <div className="absolute inset-0 rounded-full bg-red-900/20"></div>
            <div className="absolute w-6 h-6 rounded-full bg-red-900/30 top-2 left-2"></div>
            <div className="absolute w-4 h-4 rounded-full bg-red-900/20 bottom-3 right-3"></div>
          </div>

          {/* Mercury - Small rocky planet */}
          <div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 
                    bottom-40 left-40 animate-orbit-fast"
          >
            {/* Mercury's crater details */}
            <div className="absolute w-4 h-4 rounded-full bg-gray-700/40 top-2 left-2"></div>
            <div className="absolute w-3 h-3 rounded-full bg-gray-700/40 bottom-2 right-3"></div>
          </div>

          {/* Asteroid belt elements */}
          <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gray-400 rounded-full"
                style={{
                  top: `${Math.sin(i * 1.0472) * 150 + 150}px`,
                  left: `${Math.cos(i * 1.0472) * 150 + 150}px`,
                }}
              />
            ))}
          </div>

          {/* Background stars with twinkling effect */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Section for Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 relative">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="mb-8 justify-center flex flex-col items-center">
            <h1 className="text-6xl font-bold text-white animate-glow">
              Welcome
            </h1>
            <img src="/lll.png" alt="logo" className=" w-2/5 mt-2"/>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-indigo-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
                          placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                          backdrop-blur-sm transition-all duration-300
                          group-hover:border-indigo-400 group-hover:bg-slate-800/70"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-indigo-200 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
                          placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                          backdrop-blur-sm transition-all duration-300
                          group-hover:border-indigo-400 group-hover:bg-slate-800/70"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 relative overflow-hidden rounded-lg transition-all duration-300
                         bg-gradient-to-r from-indigo-600/80 to-purple-600/80 
                         hover:from-indigo-500 hover:to-purple-500
                         text-white font-semibold
                         before:absolute before:inset-0 before:bg-white/20 
                         before:translate-x-[150%] before:skew-x-[-45deg] before:transition-transform
                         hover:before:translate-x-[-150%] before:duration-700
                         hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
                         backdrop-blur-sm"
            >
              Launch
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-indigo-200 mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
