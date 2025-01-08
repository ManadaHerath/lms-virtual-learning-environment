import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../redux/api";
import { useSelector, useDispatch } from "react-redux";
import { fetchEnrolledStudents } from "../features/students/StudentSlice";

const CourseDetail = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  const { list, status } = useSelector((state) => state.students);


  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.data;
        setCourse(data);
        setEnrolled(data.enrolled);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseDetails();
    dispatch(fetchEnrolledStudents(courseId));
    if (list?.students?.length) {
      setEnrolledStudents(list.students.length);
    }
  }, [courseId, list.students, dispatch]);
  

  const handleEnroll = async () => {
    try {
      const response = await api.post(`/user/enroll/${courseId}`);
      if (response.status !== 200) {
        throw new Error("You have already enrolled");
      }
      const data = await response.data;
      showToast(data.message, 'success');
      setEnrolled(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const courseInCart = cart.find((item) => item.image_url === course.image_url);

    if (courseInCart) {
      showToast("This course is already in your cart.", 'warning');
      return;
    }

    const cartItem = {
      price: course.price,
      image_url: course.image_url,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Course added to cart successfully!", 'success');
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500'
    };
    
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2000);


  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Course details are unavailable.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/70 z-10"></div>
        <img 
          src={course.image_url || "/default-course-image.jpg"}
          alt={course.name}
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-20"></div>
        <div className="relative z-30 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{course.month}</h1>
            <div className="flex items-center gap-4">
              {enrolled ? (
                <div className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-full font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enrolled
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Enroll Now
                </button>
              )}
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium backdrop-blur-sm transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{course.description}</p>
                
                {/* Course Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: "M5 13l4 4L19 7", title: "Self-paced Learning", desc: "Learn at your own speed" },
                    { icon: "M9 12l2 2 4-4", title: "Quality Ensured", desc: "Each course is designed by us" },
                    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Lifetime Access", desc: "Access content forever" },
                    { icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", title: "Expert Support", desc: "Get help when needed" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">Rs:{course.price}</div>
                  <p className="text-gray-500">One-time payment</p>
                </div>

                <div className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                    {[
                      { label: "Students", value: `${enrolledStudents}+` },
                      { label: "Weeks", value: "4" },
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-2">
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* What's Included */}
                  <div className="space-y-3">
                    {[
                      "24/7 Course Access",
                      "Downloadable Resources",
                      "Mobile-friendly Content",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;