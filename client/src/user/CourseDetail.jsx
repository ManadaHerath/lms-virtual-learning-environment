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

  const addToCart = (course) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      courseId: course.course_id,
      name: `${course.course_type} - ${course.batch}`,
      price: course.price,
      image_url:course.image_url, // Add price here
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Course added to cart!");
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
      <p className="mb-2">Price: ${course.price}</p> {/* Display price */}
      <p className="mb-4">{course.description}</p>
      <button
        onClick={() => addToCart(course)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CourseDetail;
