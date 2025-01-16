import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
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
    batch: "",
    image: null,
  });
  const [isAccepted, setIsAccepted] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
    const newValue = e.target.checked;
    setIsAccepted(newValue);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateFirstStep = () => {
    const newErrors = {};

    if (!formData.nic.match(/^(\d{9}[vxVX]|\d{12})$/)) {
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
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecondStep = () => {
    const newErrors = {};

    if (formData.telephone && !formData.telephone.match(/^\d{10}$/)) {
      newErrors.telephone = "Invalid telephone number.";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Mobile no. is required.";
    }
    if (!formData.batch.trim()) {
      newErrors.batch = "Batch is required.";
    }
    if (!formData.street_address.trim()) {
      newErrors.street_address = "Street address is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.province.trim()) {
      newErrors.province = "Province is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFirstStep()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSecondStep()) {
      return; // Validation failed, errors will be set by validateSecondStep
    }

    if (!isAccepted) {
      enqueueSnackbar("Please accept the terms and conditions to proceed.", {variant: "warning"});
      return;
    }

    setErrors({}); // Only clear errors if validation passed
    setSuccessMessage("");

    const data = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await api.post("/user/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        enqueueSnackbar(response.data.message, { variant: "success" });
        navigate("/login");
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (err) {
      const errorData = err.response?.data?.errors;
      const errorMessage =
        errorData?.email || errorData || "An error occurred during signup";

      // Alert for email-specific or general errors
      if (typeof errorMessage === "string") {
        enqueueSnackbar(errorMessage, { variant: "error" });
      } else if (errorMessage.email) {
        enqueueSnackbar(errorMessage.email, { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred during signup", {
          variant: "error",
        });
      }

      // Enqueue snackbar message
      enqueueSnackbar(
        typeof errorMessage === "string"
          ? errorMessage
          : "An error occurred during signup",
        { variant: "error" }
      );
    }
  };
  const inputClassName =
    "w-full pl-4 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-500";
  const labelClassName = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg border border-gray-700">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8">
          {successMessage && (
            <div className="p-4 mb-4 text-emerald-400 bg-emerald-900/50 rounded-xl border border-emerald-500/50">
              {successMessage}
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-400">Join our learning community today</p>
          </div>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className={labelClassName}>NIC</label>
                  <input
                    type="text"
                    name="nic"
                    placeholder="Enter your NIC number"
                    value={formData.nic}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                  {errors.nic && (
                    <div className="text-red-400 text-sm mt-1">
                      {errors.nic}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName}>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Enter your First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                    {errors.first_name && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.first_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName}>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter your Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                    {errors.last_name && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.last_name}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />
                  {errors.email && (
                    <div className="text-red-400 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                    {errors.password && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClassName}>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={inputClassName}
                      required
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  {passwordError && (
                    <div className="text-red-400 text-sm">{passwordError}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="relative w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white py-3 px-6 rounded-xl font-medium 
                  hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900
                  transition-all duration-200 overflow-hidden group"
                >
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 flex transform translate-x-[-50%] group-hover:translate-x-[100%] transition-all duration-1000">
                    <div className="h-full w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  </div>
                  <span>Continue</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Step 2 Fields */}
                <div className="grid grid-cols-2 gap-10 ">
                  <div>
                    <label className={labelClassName}>Telephone</label>
                    <input
                      type="text"
                      name="telephone"
                      placeholder="enter your Mobile no."
                      value={formData.telephone}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    {errors.telephone && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.telephone}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClassName}>Batch</label>
                    <input
                      type="text"
                      name="batch"
                      placeholder="enter your batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    {errors.batch && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.batch}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Street Address</label>
                  <input
                    type="text"
                    name="street_address"
                    placeholder="enter your Address"
                    value={formData.street_address}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                  {errors.street_address && (
                    <div className="text-red-400 text-sm mt-1">
                      {errors.street_address}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName}>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    {errors.city && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.city}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClassName}>Province</label>
                    <input
                      type="text"
                      name="province"
                      placeholder="enter your province"
                      value={formData.province}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    {errors.province && (
                      <div className="text-red-400 text-sm mt-1">
                        {errors.province}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Profile Picture</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all duration-200 bg-gray-800/50 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAccepted}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <label className="text-gray-300">
                    Accept our{" "}
                    <a
                      href="/refund-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      refund policy
                    </a>
                    ,{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      privacy policy
                    </a>
                    , and{" "}
                    <a
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      terms & conditions
                    </a>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-800 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="relative w-1/2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white py-3 px-6 rounded-xl font-medium 
                    hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900
                    transition-all duration-200 overflow-hidden group"
                  >
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 flex transform translate-x-[-50%] group-hover:translate-x-[100%] transition-all duration-1000">
                      <div className="h-full w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                    </div>
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Sign in
            </a>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-black relative p-12 flex-col justify-between items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-gray-900/90" />
          <img src="/lll.png" alt="logo" className="w-32 mb-8 relative z-10" />
          <div className="relative z-10">
            <h2 className="text-white text-4xl font-bold mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of students already learning with us. Get access to
              premium courses, expert instructors, and a supportive community.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="relative z-10 w-full flex justify-center">
            <div className="w-full max-w-md h-64 bg-gray-800/20 rounded-2xl backdrop-blur-sm p-6 relative">
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-lg rotate-12"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-white/5 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-xl -rotate-12 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
