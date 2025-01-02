import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice";
import { useNavigate } from 'react-router-dom';

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
    navigate('/admin');
  }
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <div>
          <p>{error}</p>
          <button onClick={handleClearError}>Clear Error</button>
        </div>
      )}
    </div>
  );
};

export default AdminLog;
