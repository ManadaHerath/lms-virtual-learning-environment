import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import api from "../redux/api";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState(null); // Update to paymentType
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [coursePrice, setCoursePrice] = useState(0); // To store the course price
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {

        const response = await api.get(`/course/${courseId}/sections`);

        if (!response == 200) {
          throw new Error("Failed to fetch course sections");
        }
        
        const { weeks, payment_status, enrollment_id, price } = await response.data;
        setWeeks(weeks);
        setPaymentType(paymentType); // Use paymentType
        setEnrollmentId(enrollment_id);
        setCoursePrice(price); // Set course price
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  const isYouTubeLink = (url) => url && url.includes("youtube.com");

  const extractYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  };

  const handleCheckout = () => {
    // Redirect to payment gateway with the enrollmentId and courseId
    navigate(`/checkout?courseId=${courseId}&enrollmentId=${enrollmentId}`);
  };

  const handleMarkAsDone = async (sectionId, currentStatus) => {
    try {

      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await api.patch(
        `/course/${enrollmentId}/section/${sectionId}`,
        { mark_as_done: newStatus });

      if (!response.status !== 200) {
        throw new Error("Failed to update section status");
      }

      const { updatedSection } = await response.data;

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Course Details</h1>
        {paymentType === "pending" && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => navigate("/user/mycourse")}
          >
            Unenroll
          </button>
        )}
      </div>

      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        {paymentType === "online" ? (
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

      {weeks.length > 0 ? (
        <div>
          {weeks.map((week) => (
            <div key={`${week.week_id}-${week.sections.length}`} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Week {week.week_id}</h2>
              <div className="space-y-4">
                {week.sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-4 border rounded-lg bg-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{section.title}</h3>
                      <p className="text-sm">{section.description}</p>

                      {isYouTubeLink(section.content_url) ? (
                        <div className="text-gray-500">
                          {paymentType !== "online" ? (
                            <span>Video locked</span>
                          ) : (
                            <YouTube
                              videoId={extractYouTubeVideoId(section.content_url)}
                              opts={{
                                height: "390",
                                width: "640",
                                playerVars: {
                                  autoplay: 0,
                                },
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <a
                          href={section.content_url}
                          className={`text-blue-500 underline ${
                            paymentType !== "online" ? "pointer-events-none" : ""
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {paymentType !== "online" ? "Locked" : "View Content"}
                        </a>
                      )}
                    </div>

                    <button
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        paymentType !== "online"
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : section.mark_as_done === 1
                          ? "bg-green-100 text-black"
                          : "bg-blue-100 text-black"
                      }`}
                      disabled={paymentType !== "online"}
                      onClick={() =>
                        paymentType === "online" &&
                        handleMarkAsDone(section.id, section.mark_as_done)
                      }
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
        <p>No sections available for this course.</p>
      )}
    </div>
  );
};

export default CoursePage;
