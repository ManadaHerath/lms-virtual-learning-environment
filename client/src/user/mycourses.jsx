import React, { useEffect, useState } from "react";
import axios from "axios";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/user/enrolled-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enrolled Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No enrolled courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.course_id} className="border rounded-lg shadow p-4 bg-white">
              <img
                src={course.image_url || "placeholder.jpg"} // Fallback for missing images
                alt={course.description}
                className="w-full h-40 object-cover rounded-t"
              />
              <h2 className="text-lg font-bold mt-2">{course.batch} - {course.month}</h2>
              <p className="text-gray-700 text-sm">{course.description}</p>
              <p className="text-gray-900 font-semibold mt-1">${course.price}</p>
              <p className="text-gray-600 text-xs">Duration: {course.duration} days</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
