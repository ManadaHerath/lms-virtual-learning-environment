import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nic: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    street_address: "",
    city: "",
    province: "",
    postal_code: "",
    date_of_birth: "",
    batch: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateFirstStep = () => {
    const newErrors = {};

    if (
      !formData.nic.match(/^\d{9}[vxVX]|\d{12}$/) &&
      formData.nic.length > 12
    ) {
      newErrors.nic = "Invalid NIC format.";
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required.";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required.";
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email address.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "must be at least 8";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecondStep = () => {
    const newErrors = {};

    // Telephone validation
    if (!formData.telephone.match(/^\d{10}$/)) {
      newErrors.telephone = "Please enter a valid 10-digit telephone number.";
    }

    // Required fields validation
    if (!formData.street_address.trim()) {
      newErrors.street_address = "Street address is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.province.trim()) {
      newErrors.province = "Province is required.";
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required.";
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required.";
    }
    if (!formData.batch.trim()) {
      newErrors.batch = "Batch is required.";
    }

    // Add age validation
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16) {
      newErrors.date_of_birth =
        "You must be at least 16 years old to register.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateFirstStep()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateSecondStep()) {
        // Don't call handleSubmit directly
        // Let the form's onSubmit handle it
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate based on current step
    if (step === 1 || !validateSecondStep()) {
      return;
    }

    setErrors({});
    setSuccessMessage("");

    const data = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        data.append(key, formData[key]);
      }
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/user/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        alert(response.data.message);
        navigate("/login");
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 p-4">
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/5 py-3 px-8 rounded-2xl shadow-xl">
          {successMessage && (
            <div className="p-4 mb-4 text-green-300 bg-green-900/50 rounded-lg backdrop-blur-sm">
              {successMessage}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {step === 1 ? (
              <>
                {/* First Step Fields */}
                <div className="mb-8 justify-center flex flex-col items-center">
                  <h1 className="text-6xl font-bold text-white animate-glow">
                    Join Us
                  </h1>
                  <img src="/lll.png" alt="logo" className="w-2/5 mt-2" />
                </div>
                <div className="space-y-6">
                  {/* NIC */}
                  <div className="group">
                    <label className="block text-sm font-medium text-indigo-200 mb-1">
                      NIC
                    </label>
                    <input
                      type="text"
                      name="nic"
                      placeholder="Enter your NIC number"
                      value={formData.nic}
                      onChange={handleChange}
                      className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      required
                    />
                    {errors.nic && (
                      <div className="text-red-400 text-sm">{errors.nic}</div>
                    )}
                  </div>

                  {/* Other Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Enter your First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        required
                      />
                      {errors.first_name && (
                        <div className="text-red-400 text-sm">
                          {errors.first_name}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Enter your Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        required
                      />
                      {errors.last_name && (
                        <div className="text-red-400 text-sm">
                          {errors.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-medium text-indigo-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      required
                    />
                    {errors.email && (
                      <div className="text-red-400 text-sm">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        required
                      />
                      {errors.password && (
                        <div className="text-red-400 text-sm">
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        required
                      />
                      {errors.confirmPassword && (
                        <div className="text-red-400 text-sm">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    {passwordError && (
                      <div className="text-red-400 text-sm">
                        {passwordError}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full p-3 relative overflow-hidden rounded-lg transition-all duration-300 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold before:absolute before:inset-0 before:bg-white/20 before:translate-x-[150%] before:skew-x-[-45deg] before:transition-transform hover:before:translate-x-[-150%] before:duration-700 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] backdrop-blur-sm"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Second Step Fields */}
                <>
                  {/* Second Step Fields */}
                  <div className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Telephone
                      </label>
                      <input
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
               backdrop-blur-sm transition-all duration-300
               group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      />
                      {errors.telephone && (
                        <div className="text-red-400 text-sm">
                          {errors.telephone}
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
               backdrop-blur-sm transition-all duration-300
               group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
                 placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
                          Province
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
                 placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
               backdrop-blur-sm transition-all duration-300
               group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
               backdrop-blur-sm transition-all duration-300
               group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Batch
                      </label>
                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
               backdrop-blur-sm transition-all duration-300
               group-hover:border-indigo-400 group-hover:bg-slate-800/70"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-indigo-500/50 rounded-lg bg-slate-800/50 text-white 
               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
               file:text-sm file:font-semibold file:bg-indigo-600/80 file:text-white
               hover:file:bg-indigo-500/80 file:cursor-pointer
               backdrop-blur-sm transition-all duration-300"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/2 p-2 relative overflow-hidden rounded-lg transition-all duration-300
               bg-gradient-to-r from-gray-600/80 to-gray-700/80 
               hover:from-gray-500 hover:to-gray-600
               text-white font-semibold
               before:absolute before:inset-0 before:bg-white/20 
               before:translate-x-[150%] before:skew-x-[-45deg] before:transition-transform
               hover:before:translate-x-[-150%] before:duration-700
               backdrop-blur-sm"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className={`w-1/2 p-2 relative overflow-hidden rounded-lg transition-all duration-300
                          bg-gradient-to-r from-indigo-600/80 to-purple-600/80 
                          hover:from-indigo-500 hover:to-purple-500
                          text-white font-semibold
                          before:absolute before:inset-0 before:bg-white/20 
                          before:translate-x-[150%] before:skew-x-[-45deg] before:transition-transform
                          hover:before:translate-x-[-150%] before:duration-700
                          hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
                          backdrop-blur-sm
                          ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Complete"}
                      </button>
                    </div>
                  </div>
                </>
              </>
            )}
          </form>

          {/* Navigation Link */}
          <div className="text-center text-sm text-indigo-200 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>

      {/* Right Section with Solar System Animation */}
      <div className="hidden md:flex w-1/2 bg-slate-900 relative overflow-hidden rounded-tl-lg rounded-tr-lg rounded-bl-[200px]">
        {/* Neptune - Furthest planet */}
        <div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                      top-20 right-40 animate-float-slow opacity-80"
        >
          <div className="absolute inset-0 rounded-full bg-blue-900/30"></div>
        </div>

        {/* Uranus */}
        <div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 
                      bottom-40 left-20 animate-float"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-900/20"></div>
          {/* Uranus rings */}
          <div
            className="absolute w-48 h-2 bg-gradient-to-r from-cyan-200 to-transparent 
                       top-1/2 -left-8 rotate-45 rounded-full"
          ></div>
        </div>

        {/* Floating Asteroids */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-400 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Shooting Stars */}
        <div
          className="absolute w-40 h-px bg-gradient-to-r from-white to-transparent 
                      top-1/4 left-1/4 -rotate-45 animate-shooting-star"
        ></div>
        <div
          className="absolute w-32 h-px bg-gradient-to-r from-white to-transparent 
                      top-3/4 right-1/4 -rotate-45 animate-shooting-star-delayed"
        ></div>

        {/* Glowing Background Elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
