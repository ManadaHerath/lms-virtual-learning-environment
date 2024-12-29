import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Add course to cart
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const courseToAdd = {
      course_id: course.course_id,
      name: course.name,
      image_url: course.image_url,
      course_type: course.course_type,
      batch: course.batch,
    };

    // Check if course is already in the cart
    const courseExists = cart.some(item => item.course_id === course.course_id);
    if (!courseExists) {
      cart.push(courseToAdd); // Add to cart
      localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
      alert("Course added to cart");
    } else {
      alert("This course is already in your cart");
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <img
        src={course.image_url}
        alt={course.course_type}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{course.course_type} - {course.batch}</h1>
      <p className="mb-4">{course.description}</p>
      <button
        onClick={addToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CourseDetail;
