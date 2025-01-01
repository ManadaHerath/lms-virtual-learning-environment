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
import AdminLogin from "./admin/AdminLogin";
import AdminLog from "./admin/AdminLog";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import CourseManagement from "./admin/CourseManagement";
import StudentManagement from "./admin/StudentManagement";
import PhysicalPayment from "./admin/PhysicalPayment";
import store from "./app/store";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";

function App() {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/upload-course" element={<UploadCourse />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/mycourse" element={<MyCourse />} />
        <Route path="/user/payments" element={<PaymentHistory />} />

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
                  <Route path="course" element={<CourseManagement />} />
                  <Route path="student" element={<StudentManagement />} />
                  <Route path="payment" element={<PhysicalPayment />} />
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
