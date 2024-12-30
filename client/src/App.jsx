import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseList from "./user/CourseList";
import CourseDetail from "./user/CourseDetail";
import UploadCourse from "./admin/create_course";
import CartPage from "./user/CartPage";
import Login from './user/Login'

function App() {
  return (

    <div>

     
      {/* <Signup/> */}
 

      <UploadCourse/>

    </div>
  )

    <Router>
      <Routes>
      <Route path="/user/login" element={<Login />} />
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/upload-course" element={<UploadCourse/>} />
        <Route path="/cart" element={<CartPage/>} />
      </Routes>
    </Router>
  );

}

export default App;
