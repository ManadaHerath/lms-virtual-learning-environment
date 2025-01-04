import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, logoutAPI, checkAuthAPI } from "./authApi";
import { toast } from "react-toastify";

// Thunks for authentication actions
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutAPI();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Convert checkAuth to createAsyncThunk
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {      
      const response = await checkAuthAPI();
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
  authInitialized: false,
};

const studentAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add manual auth actions
    authSuccess: (state, action) => {
      state.user = action.payload;
      state.authInitialized = true;
      state.status = "succeeded";
      state.error = null;
    },
    authFailure: (state) => {
      state.user = null;
      state.authInitialized = true;
      state.status = "failed";
      sessionStorage.removeItem("accessToken");
    }
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.authInitialized = true;
        toast.success("Successfully logged in!");
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Register actions
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.authInitialized = true;
        toast.success("Account registered successfully!");
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      // CheckAuth actions
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.authInitialized = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.authInitialized = true;
        state.error = action.payload;
        state.user = null;
        sessionStorage.removeItem("accessToken");
        toast.error("Session expired. Please log in again.");
      })
      // Logout actions
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        sessionStorage.removeItem("accessToken");
        state.user = null;
        state.authInitialized = true;
        toast.success("Logged out successfully.");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error("Logout failed. Please try again.");
      });
  },
});

export const { clearError, authSuccess, authFailure } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;