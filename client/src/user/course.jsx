import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube"; // Import YouTube player component

const CoursePage = () => {
  const { courseId } = useParams();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sections for the course
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/course/${courseId}/sections`
        );
        setWeeks(response.data); // Set weeks data
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching course sections:", error);
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  // Function to check if the URL is a YouTube link
  const isYouTubeLink = (url) => {
    return url && url.includes("youtube.com");
  };

  // Function to extract the video ID from YouTube URL
  const extractYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      
      {loading ? (
        <p>Loading sections...</p> // Display loading message until data is fetched
      ) : weeks.length > 0 ? (
        <div>
          {weeks.map((week) => (
            <div key={week.week_id} className="mb-6">
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
                      // If the content URL is a YouTube link, render the YouTube player
                      <YouTube
                        videoId={extractYouTubeVideoId(section.content_url)}
                        opts={{
                          height: "390",
                          width: "640",
                          playerVars: {
                            autoplay: 0, // Set autoplay to 0 if you don't want the video to autoplay
                          },
                        }}
                      />
                    ) : (
                      // If it's not a YouTube link, display it as a regular link
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
