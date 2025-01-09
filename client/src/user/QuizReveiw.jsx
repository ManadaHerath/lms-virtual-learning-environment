import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, BookOpen, CheckCircle } from "lucide-react";
import api from "../redux/api";

const QuizReview = () => {
  const { courseId } = useParams();
  const { quizId } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizReviewData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const reviewResponse=await api.get(`/user/quiz/${quizId}/review/${courseId}`)
        const detailsResponse=await api.get(`/user/quiz/${quizId}/${courseId}`)
        

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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

  const totalQuestions = reviewData.length;
  const correctAnswers = reviewData.filter(
    (q) => q.student_response === q.correct_answer
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Quiz Review</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Review your answers and see the correct solutions
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {reviewData.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Question {index + 1}: {question.question_text}
              </h3>
              {question.question_image_url && (
                <img
                  src={question.question_image_url}
                  alt="Question Illustration"
                  className="mt-4 mb-6 w-full max-h-80 object-cover rounded-lg"
                />
              )}
              {question.question_type === "mcq" && (
                <div className="space-y-4">
                  {getOptionsForQuestion(question.id).map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg ${
                        option.option_text === question.correct_answer
                          ? "bg-green-50 border-2 border-green-500"
                          : option.option_text === question.student_response
                          ? "bg-red-50 border-2 border-red-500"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="text-gray-700">{option.option_text}</span>
                      {option.option_text === question.correct_answer && (
                        <span className="ml-2 text-green-600 text-sm">
                          (Correct Answer)
                        </span>
                      )}
                      {option.option_text === question.student_response &&
                        option.option_text !== question.correct_answer && (
                          <span className="ml-2 text-red-600 text-sm">
                            (Your Answer)
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Your Response:</p>
                    <p className="text-lg font-medium text-gray-900">
                      {question.student_response || "No response"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Grade:</p>
                    <p className="text-lg font-medium text-gray-900">
                      {question.student_grade !== null
                        ? `${question.student_grade} points`
                        : "Not graded"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizReview;