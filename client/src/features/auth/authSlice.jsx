import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, logoutAPI } from "./authApi";
import { toast } from 'react-toastify';

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      return data; // Return user data or token
    } catch (error) {
      return rejectWithValue(error.message); // Reject with error message
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(userData);
      return data; // Return user data
    } catch (error) {
      return rejectWithValue(error.message); // Reject with error message
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutAPI();
      return data; // Return success message or data from server
    } catch (error) {
      return rejectWithValue(error.message); // Reject with error message
    }
  }
);


const initialState = {
    user: null,
    status: 'idle', // loading, success, error states
    error: null,
  };
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload; // Save user data (e.g., token, profile)

          // Display a success message using toast
        toast.success('Successfully logged in!', {
          position: 'top-right',
          autoClose: 3000,
        });
        })
        .addCase(login.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload; // Capture error message
        })
        .addCase(register.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload; // Save user data
        })
        .addCase(register.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload; // Capture error message
        })
        .addCase(logout.pending, (state) => {
          state.status = "loading";
        })
        .addCase(logout.fulfilled, (state) => {
          state.status = "succeeded";
          state.user = null; // Clear user data on logout
        })
        .addCase(logout.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload; // Capture error message
        });
    },
  });
  
  export const { clearError } = authSlice.actions;
  
  export default authSlice.reducer;
