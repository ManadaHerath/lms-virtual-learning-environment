import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../redux/api";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [batch, setBatch] = useState(""); // State for selected batch
  const [type, setType] = useState(""); // State for selected type
  const navigate = useNavigate();
  useEffect(() => {
    fetchCourses();
  }, [batch, type]); // Refetch courses when batch or type changes

  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/courses", {
        params: { batch, type }, // Send filters as query parameters
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">Select Batch</option>
          <option value="24">Batch 24</option>
          <option value="25">Batch 25</option>
          <option value="26">Batch 26</option>
          <option value="27">Batch 27</option>
        </select>
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="REVISION">Revision</option>
          <option value="THEORY">Theory</option>
          <option value="PAPER">Paper</option>
        </select>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin/upload-course");
          }}
        >
          Create Course
        </button>
      </div>
      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Link
              to={`/admin/course/${course.course_id}`} // Navigate to course detail page
              key={course.course_id}
              className="block bg-white border border-gray-200 rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:border-gray-400"
            >
              <img
                src={course.image_url}
                alt={course.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {course.name}
              </h2>
              <div className="flex justify-between items-center">
                <button
                  className="text-sm font-medium text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/admin/course-detail/${course.course_id}`);
                  }}
                >
                  Enroll Students
                </button>
                <span className="text-sm text-gray-600">
                  {course.students_enrolled} Students
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500">No courses found</p>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
