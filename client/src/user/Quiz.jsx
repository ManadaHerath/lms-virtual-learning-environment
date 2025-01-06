import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, CheckCircle, Timer, BookOpen } from "lucide-react";
import api from "../redux/api";

const QuizPage = () => {
  const { courseId } = useParams();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasResponded, setHasResponded] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const uploadFileToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_first_upload");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxxa198zw/upload",
        formData
      );
      return response.data.secure_url || null;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}/info/${courseId}`);
        if (response.status !== 200) throw new Error("Failed to fetch quiz details");
        
        const data = response.data;
        if (!data.success) throw new Error(data.message || "Quiz not found");
        
        setQuizInfo(data.quizInfo);
        setHasResponded(data.hasResponded);
        
        const open_time = new Date(data.quizInfo.open_time).getTime();
        const close_time = new Date(data.quizInfo.close_time).getTime();
        const currentTime = Date.now();

        if ((close_time - currentTime) <= 0 && !hasSubmitted) {
          setHasSubmitted(true);
          setHasResponded(true);
          handleSubmit();
        } else if ((close_time - currentTime) <= 0 && hasSubmitted) {
          navigate('/user/mycourse');
        }

        if (open_time > currentTime) {
          alert("Quiz has not started");
          navigate(`/user/mycourse`);
        }

        setTimeRemaining(close_time - currentTime);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuizInfo();
  }, [timeRemaining]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}/${courseId}`);
        if (response.data.success) {
          setQuiz(response.data.quiz);
        } else {
          setError(response.data.message || "Failed to load quiz");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const responsesWithFileUrls = await Promise.all(
        Object.entries(responses).map(async ([questionId, response]) => {
          if (response instanceof File) {
            const uploadedFileUrl = await uploadFileToCloudinary(response);
            return {
              question_id: questionId,
              response_text: null,
              uploaded_file_url: uploadedFileUrl,
            };
          }
          return {
            question_id: questionId,
            response_text: response,
            uploaded_file_url: null,
          };
        })
      );

      const payload = {
        quiz_id: quizId,
        responses: responsesWithFileUrls,
      };

      const response = await api.post("/user/submit-quiz", payload);
      if (response.data.success) {
        alert(`Quiz submitted successfully! Total Marks: ${response.data.totalMarks}`);
      } else {
        setError(response.data.message || "Failed to submit quiz");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No quiz data available</p>
        </div>
      </div>
    );
  }

  if (hasResponded) {
    navigate(`/quizreview/${quizId}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{quiz.title}</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">{quiz.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <Timer className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {timeRemaining >= 0 ? formatTime(timeRemaining) : "00:00:00"}
                </div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Object.keys(responses).length}/{quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Question {index + 1}: {question.question_text}
              </h3>
              {question.question_type === "mcq" ? (
                <div className="space-y-4">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option.option_text}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.option_text}</span>
                    </label>
                  ))}
                </div>
              ) : question.question_type === "essay" ? (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleChange(question.id, e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              ) : null}
            </div>
          ))}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;