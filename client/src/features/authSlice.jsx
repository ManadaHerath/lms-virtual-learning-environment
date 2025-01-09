// src/store/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../redux/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  sessionExpiresAt: null,
  isLoading: false,
  error: null
};

export const checkAuth = createAsyncThunk(
  'check/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/check-auth');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const extendSession = createAsyncThunk(
  'check/extendSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/session/extend');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  'check/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const checkSlice = createSlice({
  name: 'check',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authChecked = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionExpiresAt = action.payload.sessionExpiresAt;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Extend Session
      .addCase(extendSession.fulfilled, (state, action) => {
        state.sessionExpiresAt = action.payload.sessionExpiresAt;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionExpiresAt = null;
      });
  }
});

export const { clearError } = checkSlice.actions;
export default checkSlice.reducer;