import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Users, PlusCircle, GraduationCap } from "lucide-react";
import api from "../redux/api";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [batch, setBatch] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [batch, type]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/courses", {
        params: { batch, type },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const getCourseTypeColor = (type) => {
    switch (type) {
      case 'REVISION': return 'bg-purple-500/20 text-purple-400';
      case 'THEORY': return 'bg-blue-500/20 text-blue-400';
      case 'PAPER': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Header and Filters */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-6">
          <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
            <Book className="w-6 h-6 mr-2 text-blue-400" />
            Course Management
          </h1>
          <button
            onClick={() => navigate("/admin/upload-course")}
            className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Course
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 pt-6">
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          >
            <option value="">All Batches</option>
            <option value="24">Batch 24</option>
            <option value="25">Batch 25</option>
            <option value="26">Batch 26</option>
            <option value="27">Batch 27</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="REVISION">Revision</option>
            <option value="THEORY">Theory</option>
            <option value="PAPER">Paper</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.course_id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={course.image_url}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCourseTypeColor(course.type)}`}>
                    {course.type}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                  {course.name}
                </h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{course.students_enrolled} Students</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/editcourse/${course.course_id}`)}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/admin/course-detail/${course.course_id}`)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm flex items-center"
                    >
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12 text-gray-400">
            <Book className="w-6 h-6 mr-2" />
            <span>No courses found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;