import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Calendar, Timer } from "lucide-react";
import api from "../redux/api";

const QuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasResponded, setHasResponded] = useState(false);
  const [openTime, setOpenTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [closeTime,setCloseTime]=useState(0);
  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}/info`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch quiz details");
        }
        const data = response.data;
        if (!data.success) {
          throw new Error(data.message || "Quiz not found");
        }
        setQuizInfo(data.quizInfo);
        setHasResponded(data.hasResponded);
        const openTime = new Date(data.quizInfo.open_time).getTime();
        const closeTime=new Date(data.quizInfo.close_time).getTime();
        setOpenTime(openTime);
        setCloseTime(closeTime)
        const currentTime = Date.now();
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
    if(openTime > currentTime){
      
      
    }else{
    navigate(`/quiz/${quizId}`);
    }
  };

  if (hasResponded) {
    navigate(`/quizreview/${quizId}`);
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const isQuizOpen = timeRemaining <= 0 && (closeTime- currentTime)>=0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg">
        <header className="p-5 border-b border-gray-100 bg-indigo-50">
          <h1 className="text-2xl font-semibold text-indigo-700">{quizInfo.title}</h1>
          <p className="text-gray-600 mt-1">{quizInfo.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Time Limit:{" "}
            <span className="font-medium text-gray-700">{quizInfo.time_limit_minutes} minutes</span>
          </div>
        </header>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <div className="flex flex-col gap-1">
              <span className="text-sm">
                Opens:{" "}
                {new Date(quizInfo.open_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              <span className="text-sm">
                Closes:{" "}
                {new Date(quizInfo.close_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Timer className="h-5 w-5 text-indigo-500" />
            <span className="text-sm">Duration: {quizInfo.time_limit_minutes} minutes</span>
          </div>

          {!isQuizOpen && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-sm text-gray-600">Time until quiz opens:</span>
                <span className="ml-2 font-mono text-lg text-indigo-700">
                  {timeRemaining>=0 ? formatTime(timeRemaining) : "00:00:00"}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          {isQuizOpen ? (
            <button
              onClick={handleStartQuiz}
              className="bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Quiz
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 py-2 px-4 rounded-md font-medium cursor-not-allowed"
            >
              Quiz isn't available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
