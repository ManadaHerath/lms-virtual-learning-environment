import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import CourseList from "./user/CourseList";
import CourseDetail from "./user/CourseDetail";
import UploadCourse from "./admin/create_course";
import CartPage from "./user/CartPage";
import CoursePage from "./user/course";
import Profile from "./user/Profile";
import Login from "./user/Login";
import MyCourse from "./user/mycourse";
import PaymentHistory from "./user/PaymentHistory";
import AdminLog from "./admin/AdminLog";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import CourseManagement from "./admin/CourseManagement";
import StudentManagement from "./admin/StudentManagement";
import PhysicalPayment from "./admin/PhysicalPayment";
import store from "./app/store";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import SignUp from "./user/SignUp";
import AdminCoursePage from "./admin/AdminCoursePage";
import CreateSection from "./admin/CreateSection";
import CourseDetailPage from "./admin/CourseDetailPage";
import UserProtectedRoute from "./user/UserProtectedRoute";

import Registration from "./user/Registration";

import CreateQuiz from "./admin/CreateQuiz";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<UserProtectedRoute />}>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/mycourse" element={<MyCourse />} />
            <Route path="/user/payments" element={<PaymentHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLog />} />
          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="/upload-course" element={<UploadCourse />} />
                    <Route path="student" element={<StudentManagement />} />
                    <Route path="payment" element={<PhysicalPayment />} />
                    <Route
                      path="create_section/:courseId/:weekId"
                      element={<CreateSection />}
                    />
                    <Route
                      path="course/:courseId"
                      element={<AdminCoursePage />}
                    />
                    <Route
                      path="course-detail/:courseId"
                      element={<CourseDetailPage />}
                    />
                  </Routes>
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
