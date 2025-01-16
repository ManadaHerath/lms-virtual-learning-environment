import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, BookOpen, Users, TrendingUp } from "lucide-react";
import api from "../redux/api";
import Loader from "../Loader";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [batch, setBatch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableBatches = [...new Set(courses.map((course) => course.batch))].sort();
  const availableCourseTypes = [...new Set(courses.map((course) => course.course_type))];

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const searchString = searchTerm.toLowerCase();
      return (
        (course.description?.toLowerCase().includes(searchString) ||
          course.month?.toLowerCase().includes(searchString) ||
          course.course_type?.toLowerCase().includes(searchString) ||
          course.price?.toString().includes(searchString) ||
          course.batch?.toString().includes(searchString)) &&
        (batch ? course.batch === batch : true) &&
        (type ? course.course_type === type : true)
      );
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.month) - new Date(a.month);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - More responsive text sizes */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 animate-fade-in">
              Available Courses
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Transform your future with our expert courses
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar - Improved mobile layout */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-gray-50">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{courses.length}+</div>
                <div className="text-xs sm:text-sm text-gray-600">Available Courses</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-gray-50">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">100+</div>
                <div className="text-xs sm:text-sm text-gray-600">Active Students</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-gray-50 sm:col-span-2 md:col-span-1">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">95%</div>
                <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Mobile-first approach */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </button>

              <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${isFilterOpen ? 'block' : 'hidden sm:flex'}`}>
                <select
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option value="">All Batches</option>
                  {availableBatches.map((b) => (
                    <option key={b} value={b}>Batch {b}</option>
                  ))}
                </select>

                <select
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {availableCourseTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid - Improved responsive layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {loading ? (
          // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          //   {[1, 2, 3, 4, 5, 6].map((n) => (
          //     <div key={n} className="bg-white rounded-xl overflow-hidden shadow-md">
          //       <div className="animate-pulse">
          //         <div className="bg-gray-200 h-40 sm:h-48" />
          //         <div className="p-4 sm:p-6">
          //           <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          //           <div className="h-4 bg-gray-200 rounded w-1/2" />
          //         </div>
          //       </div>
          //     </div>
          //   ))}
          // </div>
          <Loader />
        ) : filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredAndSortedCourses.map((course) => (
              <Link
                to={`/courses/${course.course_id}`}
                key={course.course_id}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative">
                    <img
                      src={course.image_url}
                      alt={course.description}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs sm:text-sm font-medium">{course.month}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-medium">
                        Batch {course.batch}
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs sm:text-sm font-medium">
                        {course.course_type}
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs sm:text-sm font-medium">
                        Rs. {parseFloat(course.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-6 sm:p-8 text-center">
            <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Courses Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;