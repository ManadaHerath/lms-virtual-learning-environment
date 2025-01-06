import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import api from "../redux/api";
import { Trash2, PlusCircle, AlertCircle } from "lucide-react";
import { useSnackbar } from "notistack";

const AdminCoursePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await api.delete(`/admin/section/${sectionId}`);
      if (!response.data.success) {
        throw new Error("Failed to delete section");
      }
      setWeeks(weeks.filter((w) => w.sections.some((s) => s.id !== sectionId)));
      enqueueSnackbar("Section delete successfull", { variant: "success" })
      
      window.location.reload();
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  };

  const handleCourseDelete = async () => {
    try {
      const response = await api.delete(`/admin/course/${courseId}`);
      if (!response.data.success) {
        throw new Error("Failed to delete course");
      }
      enqueueSnackbar("Course delete successfull", { variant: "success" })
      
      navigate("/admin/courses");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" })
      setError(err.message);
    }
  };

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/admin/course/${courseId}`);
        if (!response.data.success) {
          throw new Error("Failed to fetch course");
        }

        setCourseData(response.data.course);
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
        setWeeks(response.data.weeks);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error: {error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-200">
          {courseData ? `${courseData.course_type} ${courseData.batch}` : "Loading course name..."}
        </h1>
        <button
          onClick={handleCourseDelete}
          className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Course
        </button>
      </div>

      {courseData && courseData.weeks > 0 ? (
        <div>
          {Array.from({ length: courseData.weeks }, (_, index) => {
            const weekId = index + 1; // Week IDs start from 1
            const matchedWeek = weeks.find((w) => w.week_id === weekId); // Find matching week in `weeks`
            const sections = matchedWeek ? matchedWeek.sections : []; // Use sections if found, else empty array

            return (
              <div key={`week-${weekId}`} className="mb-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Week {weekId}</h2>
                <div className="space-y-4">
                  {sections.length > 0 ? (
                    sections.map((section) => (
                      <div
                        key={`section-${section.id}`}
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      >
                        <h3 className="text-lg font-bold text-gray-200">{section.title}</h3>
                        <p className="text-sm text-gray-400">{section.description}</p>

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
                            className="mt-4"
                          />
                        ) : (
                          section.content_url && (
                            <a
                              href={section.content_url}
                              className="text-blue-400 underline hover:text-blue-300 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Content
                            </a>
                          )
                        )}
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="flex items-center mt-4 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Section
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No sections available for this week.</p>
                  )}
                </div>
                <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/admin/create_section/${courseId}/${weekId}`);
                  }}
                  className="flex items-center mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Section
                </button>
                
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No weeks available for this course.</p>
      )}
    </div>
  );
};

export default AdminCoursePage;