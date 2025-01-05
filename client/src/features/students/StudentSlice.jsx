import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudentsAPI, deactivateStudentStatusAPI, fetchEnrolledStudentsAPI } from "./studentApi";

export const fetchStudents = createAsyncThunk("students/fetch", async () => {
  return await fetchStudentsAPI(); // Centralized API logic
});

export const deactivateStudentStatus = createAsyncThunk(
  "students/toggleStatus",
  async (data) => {
    
    return await deactivateStudentStatusAPI(data.id, data.status); // Centralized API logic
  }
);

export const fetchEnrolledStudents = createAsyncThunk(
  "students/fetchEnrolled",
  async (courseId) => {
    return await fetchEnrolledStudentsAPI(courseId); // Centralized API logic
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
      .addCase(deactivateStudentStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateStudentStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
      })
      .addCase(deactivateStudentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to toggle student status';
      })
      // Fetch Enrolled Students
      .addCase(fetchEnrolledStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEnrolledStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchEnrolledStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch enrolled students';
      });
      
  },
});

export default studentSlice.reducer;
