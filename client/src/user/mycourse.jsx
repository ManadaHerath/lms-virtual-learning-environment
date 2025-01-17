import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, TrendingUp } from "lucide-react";
import api from "../redux/api";
import Loader from "../Loader";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const[status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isActive = async () => {
      try {
        const response = await api.get("/user/isactive");
        if (response == 200) {
          setStatus(true);
        }
      } catch (err) {
        setStatus(false);
      }
    };
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get("/user/enrolled");
        if (!response == 200) {
          throw new Error("Failed to fetch enrolled courses");
        }
        const data = await response.data;
        
        // Sort courses by date (newest first)
        const sortedCourses = [...(data || [])].sort((a, b) => {
          const [yearA, monthA] = a.month.split(' ');
          const [yearB, monthB] = b.month.split(' ');
          
          // Compare years first
          if (yearA !== yearB) {
            return parseInt(yearB) - parseInt(yearA);
          }
          
          // If years are same, compare months
          const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                         'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          return months.indexOf(monthB) - months.indexOf(monthA);
        });

        setCourses(sortedCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    isActive();
    fetchEnrolledCourses();

  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      //     {[1, 2, 3].map((n) => (
      //       <div
      //         key={n}
      //         className="bg-white rounded-xl overflow-hidden shadow-md"
      //       >
      //         <div className="animate-pulse">
      //           <div className="bg-gray-200 h-48" />
      //           <div className="p-6">
      //             <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      //             <div className="h-4 bg-gray-200 rounded w-1/2" />
      //           </div>
      //         </div>
      //       </div>
      //     ))}
      //   </div>
      // </div>
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              My Enrolled Courses
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Track your learning progress and continue your educational journey
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{status ? ("Active"):("InActive")}</div>
                <div className="text-sm text-gray-600">Student Status</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  In Progress
                </div>
                <div className="text-sm text-gray-600">Learning Journey</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Enrolled Courses
            </h3>
            <p className="text-gray-600">
              You haven't enrolled in any courses yet. Browse our course catalog
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.course_id}
                onClick={() => handleCourseClick(course.course_id)}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={course.image_url || "/default-course-image.jpg"}
                    alt={course.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="px-4 py-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {course.month}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {course.batch && (
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                        Batch {course.batch}
                      </span>
                    )}
                    {course.course_type && (
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                        {course.course_type}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      Rs:{course.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;