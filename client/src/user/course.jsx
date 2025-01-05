import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import api from "../redux/api";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [coursePrice, setCoursePrice] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch course details");
        }
        setCourseDetails(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await api.get(`/course/${courseId}/sections`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch course sections");
        }
        const { weeks, paymentType, enrollment_id, price } = response.data;
        setWeeks(weeks);
        setPaymentType(paymentType);
        setEnrollmentId(enrollment_id);
        setCoursePrice(price);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseDetails();
    fetchSections();
  }, [courseId]);

  const isYouTubeLink = (url) => typeof url === "string" && url.includes("youtube.com");

  const extractYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  };

  const handleNavigateContent = (section) => {
    if (section.type_id === 3 && section.quiz_id) {
      navigate(`/quizdetail/${section.quiz_id}`);
    } else if (!isYouTubeLink(section.content_url)) {
      navigate(section.content_url);
    }
  };

  const handleCheckout = () => {
    navigate(`/checkout?courseId=${courseId}&enrollmentId=${enrollmentId}`);
  };

  const handleMarkAsDone = async (sectionId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await api.patch(
        `/course/${enrollmentId}/section/${sectionId}`,
        { mark_as_done: newStatus }
      );
      if (response.status !== 200) {
        throw new Error("Failed to update section status");
      }
      const { updatedSection } = response.data;
      setWeeks((prevWeeks) =>
        prevWeeks.map((week) => ({
          ...week,
          sections: week.sections.map((section) =>
            section.id === sectionId
              ? { ...section, mark_as_done: updatedSection.mark_as_done }
              : section
          ),
        }))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div className="p-4 text-blue-500">Loading course details...</div>;
  }

  const courseTitle = courseDetails
    ? `${courseDetails.course_type} ${courseDetails.batch}`
    : "Course Details";

  return (
    <div className="container mx-auto p-4">
      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        {paymentType === "online" || paymentType === "physical" ? (
          <div className="text-green-500 font-semibold">You have paid for this course!</div>
        ) : (
          <div>
            <p className="mb-2 text-gray-700">
              Course Price: <span className="font-bold text-lg">${coursePrice}</span>
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {courseDetails && (
        <div className="bg-white shadow rounded-lg p-8 mb-10 flex flex-col md:flex-row items-center md:items-start">
          <img
            src={courseDetails.image_url}
            alt={courseTitle}
            className="w-48 h-48 object-cover rounded-lg shadow-md"
          />
          <div className="md:ml-8 mt-6 md:mt-0">
            <h1 className="text-4xl font-extrabold text-gray-900">{courseTitle}</h1>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed">
              {courseDetails.description}
            </p>
          </div>
        </div>
      )}

      {weeks.length > 0 ? (
        <div className="space-y-8">
          {weeks.map((week) => (
            <div key={week.week_id}>
              <h2 className="text-2xl font-bold mb-4">Week {week.week_id}</h2>
              <div className="space-y-6">
                {week.sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-6 bg-gray-50 shadow-md rounded-lg flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                      {paymentType !== "online" ? (
                        <div className="text-gray-500">
                          Content locked. Please proceed to checkout to unlock.
                        </div>
                      ) : isYouTubeLink(section.content_url) ? (
                        <YouTube
                          videoId={extractYouTubeVideoId(section.content_url)}
                          opts={{
                            height: "360",
                            width: "640",
                            playerVars: { autoplay: 0 },
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => handleNavigateContent(section)}
                          className="text-blue-600 underline font-medium hover:text-blue-800 transition"
                        >
                          View Content
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        paymentType === "online" &&
                        handleMarkAsDone(section.id, section.mark_as_done)
                      }
                      disabled={paymentType !== "online"}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                        paymentType !== "online"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : section.mark_as_done === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {section.mark_as_done === 1 ? "Completed" : "Incomplete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No sections available for this course.</p>
      )}
    </div>
  );
};

export default CoursePage;
