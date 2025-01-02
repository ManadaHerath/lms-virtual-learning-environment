import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import api from "../redux/api";

const AdminCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData,setCourseData]=useState();
  //fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        


        const response = await api.get(`/admin/course/${courseId}`)
        
        if (!response.data.success) {
          throw new Error("Failed to fetch course");
        }
        
        const courseData = response.data.course;
        
        setCourseData(courseData)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Fetch sections for the course
  useEffect(() => {
    const fetchSections = async () => {
      try {
        

        const response = await api.get(`/admin/course/${courseId}/sections`);
        
        if (!response.data) {
          throw new Error("Failed to fetch course sections");
        }

        const weeks=response.data.weeks;
        setWeeks(weeks);
        
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
  
      {courseData && courseData.weeks > 0 ? (
        <div>
          {Array.from({ length: courseData.weeks }, (_, index) => {
            const weekId = index + 1; // Week IDs start from 1
            const matchedWeek = weeks.find((w) => w.week_id === weekId); // Find matching week in `weeks`
            const sections = matchedWeek ? matchedWeek.sections : []; // Use sections if found, else empty array
  
            return (
              <div key={`week-${weekId}`} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Week {weekId}</h2>
                <div className="space-y-4">
                  {sections.length > 0 ? (
                    sections.map((section) => (
                      <div
                        key={`section-${section.id}`}
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
                    ))
                  ) : (
                    <p className="text-gray-500">No sections available for this week.</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/admin/create_section/${courseId}/${weekId}`);
                  }}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Add Section
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No weeks available for this course.</p>
      )}
    </div>
  );
  
  
};

export default AdminCoursePage;
