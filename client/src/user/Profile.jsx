import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await response.json();
        setCourse(data.course);
        setEnrolled(data.isEnrolled);
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in the course");
      }

      const data = await response.json();
      alert(data.message);
      setEnrolled(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-4 text-blue-500">Loading course details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
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
      {!enrolled ? (
        <button
          onClick={handleEnroll}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Enroll Now
        </button>
      ) : (
        <div className="p-2 bg-green-500 text-white rounded">
          You are already enrolled in this course.
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
