import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../redux/api";

const QuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // Countdown timer
  const [hasResponded, setHasResponded] = useState(false); // Track if the user has responded

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}/info`);

        if (!response.status == 200) {
          throw new Error("Failed to fetch quiz details");
        }

        const data = response.data;

        if (!data.success) {
          throw new Error(data.message || "Quiz not found");
        }

        setQuizInfo(data.quizInfo);
        setHasResponded(data.hasResponded); // Set the hasResponded flag

        // Calculate time remaining until quiz opens
        const openTime = new Date(data.quizInfo.open_time).getTime();
        const currentTime = Date.now();
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
      return () => clearInterval(timer); // Cleanup interval
    }
  }, [timeRemaining]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${quizId}`); // Navigate to quiz start page
  };

  const handleReviewQuiz = () => {
    navigate(`/quizreview/${quizId}`); // Navigate to quiz review page
  };

  if (loading) {
    return <div className="p-4 text-blue-500">Loading quiz details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const isQuizOpen = timeRemaining <= 0;

  // Navigate to quiz review page if the user has already responded
  if (hasResponded) {
    navigate(`/quizreview/${quizId}`);
    return null; // Prevent further rendering
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Details</h1>
      {quizInfo ? (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold">{quizInfo.title}</h2>
          <p className="text-gray-700">{quizInfo.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Open Time: {new Date(quizInfo.open_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Close Time: {new Date(quizInfo.close_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Time Limit: {quizInfo.time_limit_minutes} minutes
          </p>

          {isQuizOpen ? (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button>
          ) : (
            <div className="mt-4">
              <p className="text-gray-500">Quiz starts in:</p>
              <p className="text-lg font-bold text-red-500">
                {formatTime(timeRemaining)}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
                disabled
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Quiz details not available.</p>
      )}
    </div>
  );
};

export default QuizDetails;
