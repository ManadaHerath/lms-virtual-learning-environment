import React, { useEffect, useState } from "react";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);  // Ensure it's initialized as an empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch("http://localhost:3000/user/enrolled", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const data = await response.json();
        console.log(data.c);
        setCourses(data || []);  // Ensure data.courses is handled correctly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div className="p-4 text-blue-500">Loading enrolled courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enrolled Courses</h1>
      {courses.length === 0 ? (
        <div className="p-4 text-gray-500">You are not enrolled in any courses.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105"
            >
              <img
                src={course.image_url || "/default-course-image.jpg"}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{course.name}</h3>
                <p className="mt-2 text-gray-600">Price: ${course.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
