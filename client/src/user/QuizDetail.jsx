import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Calendar, Timer, BookOpen, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../redux/api";
import Loader from "../Loader";
import moment from "moment-timezone";

const QuizDetails = () => {
  const { courseId } = useParams();
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasResponded, setHasResponded] = useState(false);
  const [openTime, setOpenTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [closeTime, setCloseTime] = useState(0);

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}/info/${courseId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch quiz details");
        }
        const data = response.data;
        if (!data.success) {
          throw new Error(data.message || "Quiz not found");
        }
        setQuizInfo(data.quizInfo);
        setHasResponded(data.hasResponded);
        const openTime = moment.utc(data.quizInfo.open_time).tz("Asia/Colombo").valueOf();
        const closeTime = moment.utc(data.quizInfo.close_time).tz("Asia/Colombo").valueOf();
        const currentTime = moment().tz("Asia/Colombo").valueOf();
        
        setOpenTime(openTime);
        setCloseTime(closeTime);

        setCurrentTime(currentTime);
        setTimeRemaining(openTime - currentTime);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuizInfo();
  }, [quizId]);
  const formatLocalTime = (utcDateString) => {
    return moment.utc(utcDateString).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss");
  };
  


  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1000);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    if (openTime > currentTime) {
      return;
    }
    navigate(`/quiz/${quizId}/${courseId}`);
  };

  if (hasResponded) {
    navigate(`/quizreview/${quizId}/${courseId}`);
    return null;
  }

  if (loading) {
    return (
      // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      //   <div className="max-w-4xl mx-auto">
      //     <div className="animate-pulse">
      //       <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
      //       <div className="bg-white rounded-xl shadow-lg p-6">
      //         <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      //         <div className="space-y-4">
      //           {[1, 2, 3].map((n) => (
      //             <div key={n} className="h-4 bg-gray-200 rounded w-full" />
      //           ))}
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const isQuizOpen = timeRemaining <= 0 && (closeTime - currentTime) >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">Quiz Details</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Review the quiz information and start when you're ready
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <Timer className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {quizInfo.time_limit_minutes} mins
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {isQuizOpen ? "Open" : "Not Open"}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">Ready</div>
                <div className="text-sm text-gray-600">Your Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Details Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-900">{quizInfo.title}</h2>
            <p className="mt-2 text-gray-600">{quizInfo.description}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Opens:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(quizInfo.open_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Closes:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(quizInfo.close_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {!isQuizOpen && timeRemaining > 0 && (
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="text-sm font-medium text-blue-700">Time until quiz opens:</span>
                    <span className="ml-2 font-mono text-lg text-blue-800">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-lg">
                <Timer className="h-5 w-5 text-indigo-500" />
                <div>
                  <span className="text-sm font-medium text-indigo-700">Quiz Duration:</span>
                  <span className="ml-2 text-indigo-800">
                    {quizInfo.time_limit_minutes} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
            {isQuizOpen ? (
              <button
                onClick={handleStartQuiz}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Quiz Now
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Quiz Not Available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;