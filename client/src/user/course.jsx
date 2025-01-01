import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch sections for the course
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch(
          `http://localhost:3000/course/${courseId}/sections`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course sections");
        }

        const { weeks, payment_status, enrollment_id } = await response.json();
        setWeeks(weeks);
        setPaymentStatus(payment_status);
        setEnrollmentId(enrollment_id);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  // Function to check if the URL is a YouTube link
  const isYouTubeLink = (url) => url && url.includes("youtube.com");

  // Function to extract the YouTube video ID
  const extractYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  };

  // Function to mark a section as done
  const handleMarkAsDone = async (sectionId, currentStatus) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status

      const response = await fetch(
        `http://localhost:3000/course/${enrollmentId}/section/${sectionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ mark_as_done: newStatus }), // Send the new status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update section status");
      }

      // Parse the updated section from the response
      const { updatedSection } = await response.json();

      // Optimistically update the UI by using the updated mark_as_done
      setWeeks((prevWeeks) =>
        prevWeeks.map((week) => ({
          ...week,
          sections: week.sections.map((section) =>
            section.id === sectionId
              ? { ...section, mark_as_done: updatedSection.mark_as_done } // Update with the new value from backend
              : section
          ),
        }))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle checkout
  const handleCheckout = () => {
    navigate(`/checkout/${enrollmentId}`);
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
        {paymentStatus === "completed" && (
          <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded">
            Paid
          </span>
        )}
      </div>

      {paymentStatus === "pending" && (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p className="text-yellow-800">
            Your payment is pending. You can only access Week 1 sections.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}

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
                      ) : (
                        section.content_url && (
                          <a
                            href={section.content_url}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Content
                          </a>
                        )
                      )}
                    </div>

                    {/* Button for Marking Section */}
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        section.mark_as_done === 1
                          ? "bg-green-100 text-black" // Completed
                          : "bg-blue-100 text-black" // Incomplete
                      }`}
                      onClick={() => handleMarkAsDone(section.id, section.mark_as_done)}
                    >
                      {section.mark_as_done === 1
                        ? "Completed"
                        : "Incomplete"}
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
