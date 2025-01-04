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
    return <div className="p-4 text-blue-500">Loading quiz review...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Review</h1>
      {reviewData.length > 0 ? (
        reviewData.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-lg bg-gray-50 mb-4">
            <h2 className="text-lg font-semibold">
              Q{index + 1}: {question.question_text}
            </h2>
            {question.question_image_url && (
              <img
                src={question.question_image_url}
                alt="Question Illustration"
                className="mt-2 mb-4 max-w-full rounded-lg"
              />
            )}
            {question.question_type === "mcq" && (
              <div>
                <h3 className="text-gray-700 font-medium">Options:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {getOptionsForQuestion(question.id).map((option) => (
                    <li
                      key={option.id}
                      className={`${
                        option.option_text === question.correct_answer
                          ? "text-green-600 font-semibold"
                          : option.option_text === question.student_response
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {option.option_text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2">
              <p className="text-gray-700">
                <strong>Your Response:</strong>{" "}
                {question.student_response || (
                  <span className="text-red-500">No response</span>
                )}
              </p>
              <p className="text-gray-700">
                <strong>Correct Answer:</strong>{" "}
                {question.correct_answer || <span className="text-gray-500">N/A</span>}
              </p>
              <p className="text-gray-700">
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
        <p className="text-gray-500">No review data available for this quiz.</p>
      )}
    </div>
  );
};

export default QuizReview;
