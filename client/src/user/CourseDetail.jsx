import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../redux/api";

const CourseDetail = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [course, setCourse] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false); // Track enrollment status

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details and enrollment status from the backend
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.data;
        setCourse(data); // Set course details
        setEnrolled(data.enrolled); // Set enrollment status from backend response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const response = await api.post(`/user/enroll/${courseId}`);
      console.log(response);
      if (response.status !== 200) {
        throw new Error("You have already enrolled");
      }
      const data = await response.data;
      alert(data.message);
      setEnrolled(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const courseInCart = cart.find((item) => item.courseId === course.id);

    if (courseInCart) {
      alert("This course is already in your cart.");
      return;
    }

    const cartItem = {
      courseId: course.id,
      name: course.name,
      price: course.price,
      image_url: course.image_url,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Course added to cart successfully!");
  };

  if (loading) {
    return <div className="p-4 text-blue-500">Loading course details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return <div className="p-4 text-gray-500">Course details are unavailable.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <img
          src={course.image_url || "/default-course-image.jpg"}
          alt={course.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="mb-4 text-gray-700">{course.description}</p>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Price:</strong> ${course.price}
          </p>
          <p>
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <p>
            <strong>Duration:</strong> {course.duration} hours
          </p>
          <p>
            <strong>Category:</strong> {course.category}
          </p>
        </div>
        <div className="flex space-x-4 mt-6">
          {enrolled ? (
            <div className="p-2 bg-green-500 text-white rounded">
              You have already enrolled in this course.
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Enroll Now
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
