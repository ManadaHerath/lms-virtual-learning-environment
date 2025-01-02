import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudentsAPI, toggleStudentStatusAPI } from "./studentAPI";

export const fetchStudents = createAsyncThunk("students/fetch", async () => {
  return await fetchStudentsAPI(); // Centralized API logic
});

export const toggleStudentStatus = createAsyncThunk(
  "students/toggleStatus",
  async (id) => {
    return await toggleStudentStatusAPI(id, "toggle-status"); // Centralized API logic
  }
);


const studentSlice = createSlice({
  name: 'students',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // To store error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch students';
      })
      // Toggle Student Status
      .addCase(toggleStudentStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleStudentStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(toggleStudentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to toggle student status';
      });
  },
});

export default studentSlice.reducer;