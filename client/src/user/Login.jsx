import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    console.log("Form submitted:", isLogin ? "Login" : "Signup");
  };

  const getWelcomeMessage = () => {
    if (!email) return isLogin ? "Welcome Back!" : "Join Our Community";
    if (isLogin) {
      return `Welcome back${
        email.includes("@") ? ", " + email.split("@")[0] : ""
      }!`;
    }
    return "Almost There!";
  };

  const getSubtitle = () => {
    if (isLogin) {
      return "Pick up where you left off - your designs are waiting";
    }
    return "Join thousands of designers sharing and growing together";
  };

  return (
    <div className="flex h-screen w-full transition-all">
      {/* Image Section */}
      <div
        className={`relative hidden md:flex md:w-3/5 bg-slate-900 transition-all duration-500 ${
          isLogin ? "order-first" : "order-last"
        }`}
        style={{
          clipPath: `polygon(0 0, 100% 0, ${
            isLogin ? "80% 100%, 0 100%" : "100% 100%, 20% 100%"
          })`, // Adjust the clipPath for login/signup
          backgroundImage: `url('/public/${isLogin ? "1" : "2"}.png')`,
          backgroundSize: "cover", // Ensure the image is scaled to cover the container
          backgroundPosition: "", // Ensure the image is centered within the container
          borderRadius: "0 0 1rem 1rem", // Apply rounded corners to the image
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />

        {/* Testimonials on image side */}
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="text-lg font-medium mb-2">
            {isLogin
              ? '"UISOCIAL helped me grow my design skills exponentially"'
              : '"Joining UISOCIAL was the best career decision I made"'}
          </p>
          <p className="text-sm opacity-90">
            {isLogin
              ? "- Sarah Chen, Product Designer"
              : "- Marcus Rodriguez, UI Designer"}
          </p>
        </div>

        {/* Auth toggle on image side */}
        <div className="absolute top-4 left-4">
          {!isLogin && (
            <button
              onClick={toggleAuth}
              className="text-sm text-white hover:text-red-200 font-semibold transition"
            >
              Already have an account? Login
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-white transition-all duration-500 relative">
        <div className="absolute top-4 right-4">
          {isLogin && (
            <button
              onClick={toggleAuth}
              className="text-sm text-red-500 hover:text-red-600 font-semibold transition"
            >
              New here? Create account
            </button>
          )}
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {getWelcomeMessage()}
            </h2>
            <p className="text-gray-600">{getSubtitle()}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 transition"
                    required
                  />
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </span>
                </>
              ) : (
                <span>{isLogin ? "Login" : "Create account"}</span>
              )}
            </button>

            {!isLogin && (
              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-red-500 hover:text-red-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-500 hover:text-red-600">
                  Privacy Policy
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
