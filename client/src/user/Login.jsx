import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/user/login', {
        "email":email,
        "password":password
    },{withCredentials:true});
    
    if(res.data.success){
      sessionStorage.setItem('accessToken',res.data.accessToken);
      
      prompt(res.data.message);
    }else{
      
      prompt(res.data.message);
    }
    } catch (error) {
      
    }
    
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side with background image */}
      <div className="relative hidden md:flex md:w-1/2 bg-slate-900">
        <div className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/public/image.jpg')",
            backgroundBlendMode: 'overlay'
          }} 
        />
        
        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white">
          <div className="text-lg font-semibold">Selected Works</div>
          <div className="space-x-4">
            <button className="px-4 py-1 rounded-full border border-white/30 hover:bg-white/10 transition">
              Sign Up
            </button>
            <button className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
              Join Us
            </button>
          </div>
        </div>

        {/* Bottom profile card */}
        <div className="absolute bottom-6 left-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <div className="font-medium">Andrew.ui</div>
            <div className="text-sm opacity-80">UI & Illustration</div>
          </div>
          <div className="ml-4 space-x-2">
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition">←</button>
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition">→</button>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">UISOCIAL</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">EN</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Hi Designer</h2>
            <p className="text-gray-600">Welcome to UISOCIAL</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-sm text-red-500 hover:text-red-600">
                Forgot password?
              </a>
            </div>

            {/* Google login button */}
            <button
              type="button"
              className="w-full p-3 border border-gray-200 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Login with Google</span>
            </button>

            {/* Main login button */}
            <button
              type="submit"
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Login
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-red-500 hover:text-red-600">
                Sign up
              </a>
            </div>

            {/* Social links */}
            <div className="flex justify-center space-x-6 pt-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;