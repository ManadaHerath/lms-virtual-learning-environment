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
import store from "./app/store";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import SignUp from "./user/SignUp";
import AdminCoursePage from "./admin/AdminCoursePage";
import CreateSection from "./admin/CreateSection";
import QuizDetail from "./user/QuizDetail";
import Quiz from "./user/Quiz";
import CourseDetailPage from "./admin/CourseDetailPage";
import UserProtectedRoute from "./user/UserProtectedRoute";
import Registration from "./user/Registration";
import CreateQuiz from "./admin/CreateQuiz";
import ApproveRejectRegitration from "./admin/ApproveRejectRegitration";
import AdminEditCourse from "./admin/AdminEditCourse";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
            
         <Route element={<UserProtectedRoute />}>
          <Route path="/register" element={<Registration />} />
          <Route path="/quizdetail/:quizId" element={<QuizDetail />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/mycourse" element={<MyCourse />} />
          <Route path="/user/payments" element={<PaymentHistory />} />
        </Route>

          <Route path="/admin/create-quiz" element={<CreateQuiz />} />
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
                    <Route path="/student/register/:nic" element={<ApproveRejectRegitration />} />
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
                    <Route
                      path="editcourse/:courseId"
                      element={<AdminEditCourse />}
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
