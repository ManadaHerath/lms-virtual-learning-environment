import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "../features/students/StudentSlice";
import authReducer from "../features/auth/authSlice";
import studentAuthReducer from "../features/userAuth/authSlice"

const store = configureStore({
  reducer: {
    students: studentReducer,
    auth: authReducer,
    studentAuth: studentAuthReducer,
    // Add other feature reducers here
  },
});

export default store;
