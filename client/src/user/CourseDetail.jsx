import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [course, setCourse] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false); // Track enrollment status

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        // Fetch course details and enrollment status from the backend
        const response = await fetch(`http://localhost:3000/user/courses/${courseId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await response.json();
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
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:3000/user/enroll/${courseId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("You have already enrolled");
      }

      const data = await response.json();
      console.log(data);
      alert(data.message);

      // After successful enrollment, update the local state
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{course.name}</h1>
      <img
        src={course.image_url || "/default-course-image.jpg"}
        alt={course.name}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="mb-4 text-gray-700">{course.description}</p>
      <p className="mb-4">
        <strong>Price:</strong> ${course.price}
      </p>
      <p className="mb-4">
        <strong>Instructor:</strong> {course.instructor}
      </p>
      <p className="mb-4">
        <strong>Duration:</strong> {course.duration} hours
      </p>
      <p className="mb-4">
        <strong>Category:</strong> {course.category}
      </p>
      <div className="flex space-x-4">
        {enrolled ? (
          <div className="p-2 bg-green-500 text-white rounded">
            You have already enrolled in this course.
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Enroll Now
          </button>
        )}
        <button
          onClick={handleAddToCart}
          className="p-2 bg-yellow-500 text-white rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
