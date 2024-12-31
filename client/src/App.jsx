import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseList from "./user/CourseList";
import CourseDetail from "./user/CourseDetail";
import UploadCourse from "./admin/create_course";
import CartPage from "./user/CartPage";

import CoursePage from "./user/course";
import Profile from "./user/Profile";
import Login from './user/Login';
import MyCourse from './user/mycourse';
import SignUp from './user/SignUp';



function App() {
  return (

    

    <Router>
      <Routes>
      <Route path="/user/login" element={<Login />} />
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/upload-course" element={<UploadCourse/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/mycourse" element={<MyCourse />} />
        <Route path="/user/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );

}

export default App;
