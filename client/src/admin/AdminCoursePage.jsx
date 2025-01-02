import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

const AdminCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
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
          `http://localhost:3000/admin/course/${courseId}/sections`,
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

        const { weeks} = await response.json();
        setWeeks(weeks);
        console.log(weeks);
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
                    className="p-4 border rounded-lg bg-gray-100"
                  >
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
                ))}
              </div>
              <button onClick={(e)=>{
                e.preventDefault();
                navigate(`/admin/create_section/${courseId}/${week.week_id}`)
              }}>
                Add section
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No sections available for this course.</p>
      )}
    </div>
  );
};

export default AdminCoursePage;
