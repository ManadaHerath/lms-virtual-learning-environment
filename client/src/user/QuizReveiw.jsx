import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../redux/api";

const QuizReview = () => {
  const { quizId } = useParams(); // Extract quiz ID from the URL
  const [reviewData, setReviewData] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizReviewData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Use stored token

        // Fetch quiz review data
        const reviewResponse = await api.get(`/user/quiz/${quizId}/review`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // Fetch quiz details
        const detailsResponse = await api.get(`/user/quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // Check responses
        if (!reviewResponse.status === 200 || !detailsResponse.status === 200) {
          throw new Error("Failed to fetch quiz review or details");
        }

        const reviewData = reviewResponse.data;
        const detailsData = detailsResponse.data;

        if (!reviewData.success || !detailsData.success) {
          throw new Error("Unable to fetch quiz review or details");
        }

        setReviewData(reviewData.review);
        setQuizDetails(detailsData.quiz);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizReviewData();
  }, [quizId]);

  const getOptionsForQuestion = (questionId) => {
    const question = quizDetails?.questions?.find((q) => q.id === questionId);
    return question?.options || [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-500 text-lg">
        Loading quiz review...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Quiz Review</h1>
      {reviewData.length > 0 ? (
        reviewData.map((question, index) => (
          <div
            key={question.id}
            className="p-6 bg-white shadow-lg rounded-lg mb-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Q{index + 1}: {question.question_text}
            </h2>
            {question.question_image_url && (
              <img
                src={question.question_image_url}
                alt="Question Illustration"
                className="mt-4 mb-6 w-full max-h-80 object-cover rounded-lg"
              />
            )}
            {question.question_type === "mcq" && (
              <div>
                <h3 className="text-lg font-medium text-gray-600">Options:</h3>
                <ul className="list-none space-y-2 mt-2">
                  {getOptionsForQuestion(question.id).map((option) => (
                    <li
                      key={option.id}
                      className={`p-2 rounded-lg shadow-sm ${
                        option.option_text === question.correct_answer
                          ? "bg-green-100 text-green-800 font-semibold"
                          : option.option_text === question.student_response
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {option.option_text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Your Response:</strong>{" "}
                {question.student_response ? (
                  <span className="text-blue-600">{question.student_response}</span>
                ) : (
                  <span className="text-red-500">No response</span>
                )}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Correct Answer:</strong>{" "}
                {question.correct_answer ? (
                  <span className="text-green-600">{question.correct_answer}</span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Grade:</strong>{" "}
                {question.student_grade !== null ? (
                  <span className="text-green-600">{question.student_grade}</span>
                ) : (
                  <span className="text-red-500">Not graded</span>
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center text-lg">
          No review data available for this quiz.
        </p>
      )}
    </div>
  );
};

export default QuizReview;
