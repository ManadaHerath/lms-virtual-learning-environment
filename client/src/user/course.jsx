import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import api from "../redux/api";
import { Lock, PlayCircle, CheckCircle, XCircle, Book, FileText } from 'lucide-react';

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
  const [activeWeek, setActiveWeek] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status !== 200) throw new Error("Failed to fetch course details");
        setCourseDetails(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await api.get(`/course/${courseId}/sections`);
        if (response.status !== 200) throw new Error("Failed to fetch course sections");
        const { weeks, paymentType, enrollment_id, price } = response.data;
        setWeeks(weeks);
        setPaymentType(paymentType);
        setEnrollmentId(enrollment_id);
        setCoursePrice(price);
        setActiveWeek(weeks[0]?.week_id);
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
      navigate(`/quizdetail/${section.quiz_id}/${courseId}`);
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
      if (response.status !== 200) throw new Error("Failed to update section status");
      
      const { updatedSection } = response.data;
      setWeeks(prevWeeks =>
        prevWeeks.map(week => ({
          ...week,
          sections: week.sections.map(section =>
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Error Loading Course</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600 text-lg">Loading course content...</div>
      </div>
    );
  }

  const isPaid = paymentType === "online" || paymentType === "physical";
  const courseTitle = courseDetails ? `${courseDetails.course_type} ${courseDetails.batch}` : "Course Details";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {courseDetails?.image_url && (
              <img
                src={courseDetails.image_url}
                alt={courseTitle}
                className="w-full md:w-64 h-48 object-cover rounded-xl shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{courseTitle}</h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                {courseDetails?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enrollment Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enrollment Status</h3>
              <div className={`mt-2 inline-flex items-center ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                {isPaid ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                <span className="font-medium">{isPaid ? 'Enrolled' : 'Not Enrolled'}</span>
              </div>
            </div>
            {!isPaid && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-2">Rs.{coursePrice}</div>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Week Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Course Contents</h3>
              <div className="space-y-2">
                {weeks.map((week) => (
                  <button
                    key={week.week_id}
                    onClick={() => setActiveWeek(week.week_id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeWeek === week.week_id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    Week {week.week_id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Week Content */}
          <div className="lg:col-span-3">
            {weeks.map((week) => (
              <div
                key={week.week_id}
                className={`${activeWeek === week.week_id ? 'block' : 'hidden'}`}
              >
                <div className="space-y-4">
                  {week.sections.map((section) => (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {section.title}
                            </h3>
                            <p className="text-gray-600">{section.description}</p>
                          </div>
                          {isPaid && (
                            <button
                              onClick={() => handleMarkAsDone(section.id, section.mark_as_done)}
                              className={`ml-4 px-4 py-2 rounded-lg font-medium ${
                                section.mark_as_done === 1
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {section.mark_as_done === 1 ? 'Completed' : 'Mark Complete'}
                            </button>
                          )}
                        </div>

                        <div className="mt-6">
                          {isYouTubeLink(section.content_url) ? (
                            isPaid && paymentType === "online" ? (
                              <YouTube
                                videoId={extractYouTubeVideoId(section.content_url)}
                                opts={{
                                  width: '100%',
                                  height: '400',
                                  playerVars: { autoplay: 0 },
                                }}
                              />
                            ) : (
                              <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Enroll online to access this content</p>
                              </div>
                            )
                          ) : (
                            <div className="mt-4">
                              {isPaid ? (
                                <button
                                  onClick={() => handleNavigateContent(section)}
                                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                >
                                  <FileText className="w-5 h-5 mr-2" />
                                  View Content
                                </button>
                              ) : (
                                <div className="text-gray-500">
                                  <Lock className="w-5 h-5 inline mr-2" />
                                  Content locked
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
