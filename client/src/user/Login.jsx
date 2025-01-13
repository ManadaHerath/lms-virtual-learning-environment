import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import api from "../redux/api";
import { useSnackbar } from "notistack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        enqueueSnackbar("Welcome back!", { variant: "success" });
        const loginResponse = {
          accessTokenExpiresIn: res.data.accessTokenExpiresIn,
        };
        const accessTokenExpiryTime =
          Date.now() + loginResponse.accessTokenExpiresIn * 1000;
        localStorage.setItem("accessTokenExpiry", accessTokenExpiryTime);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        enqueueSnackbar(res.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to log in", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg border border-gray-700">
        {/* Left Section - Illustration/Brand */}
        <div className="hidden lg:block lg:w-1/2 relative bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-gray/90 to-gray-900/90" />
          <img
            src="Heading.png"
            alt="Brand"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray via-transparent to-transparent" />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
            <p className="text-gray-400">
              Please enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white py-3 px-6 rounded-xl font-medium 
              hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900
              transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed
              overflow-hidden group"
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0 flex transform translate-x-[-50%] group-hover:translate-x-[100%] transition-all duration-1000">
                <div className="h-full w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
              </div>
              {/* Button content */}
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
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