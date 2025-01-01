import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "../features/students/StudentSlice";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    students: studentReducer,
    auth: authReducer,
    // Add other feature reducers here
  },
});

export default store;
