import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../redux/api";

const QuizPage = () => {
  const { quizId } = useParams();
  const [quizInfo, setQuizInfo] = useState(null);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState();
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

      if (response.data.secure_url) {
        
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload file to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
  };
  //fetch quiz info and timer
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
        const open_time = new Date(data.quizInfo.open_time).getTime();
        const close_time = new Date(data.quizInfo.close_time).getTime();
        const currentTime = Date.now();
        if((close_time - currentTime)<=0 && !hasSubmitted){
          setHasSubmitted(true);
          setHasResponded(true);
          
          handleSubmit(); 

        }else if((close_time - currentTime)<=0 && hasSubmitted){
          navigate('/user/mycourse')
        }

        if(open_time > currentTime){
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


  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };


   // Add `hasResponded` to dependencies
  

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/user/quiz/${quizId}`);
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

  const handleChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
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
          } else {
            return {
              question_id: questionId,
              response_text: response,
              uploaded_file_url: null,
            };
          }
        })
      );

      const payload = {
        quiz_id: quizId,
        responses: responsesWithFileUrls,
      };

      const response = await api.post("/user/submit-quiz", payload);

      if (response.data.success) {
        
        setMessage(`Quiz submitted successfully! Total Marks: ${response.data.totalMarks}`);
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

  if (!quiz) {
    return <div className="container mx-auto p-4 max-w-2xl text-lg">No quiz data available</div>;
  }
  if (hasResponded) {
    navigate(`/quizreview/${quizId}`);
    return null;
  }
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg">
        <header className="p-6 border-b border-gray-100 bg-indigo-50">
          <h1 className="text-3xl font-semibold text-indigo-700">{quiz.title}</h1>
          <p className="text-gray-600 mt-2">{quiz.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            Total Questions: <span className="font-medium text-gray-700">{quiz.questions.length}</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-indigo-700 bg-indigo-100 py-2 px-4 rounded-md inline-block shadow">
  Time Remaining: <span className="font-bold">{timeRemaining>=0 ? formatTime(timeRemaining) :"00:00:00"}</span>
</p>
        </header>
        <form onSubmit={(e)=>{e.preventDefault();handleSubmit();}} className="p-6 space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Question {index + 1}: {question.question_text}
              </h3>
              {question.question_type === "mcq" ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 text-gray-700">
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option.option_text}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        className="w-5 h-5 text-indigo-500 border-gray-300 focus:ring-indigo-400"
                      />
                      <span>{option.option_text}</span>
                    </label>
                  ))}
                </div>
              ) : question.question_type === "essay" ? (
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleChange(question.id, e.target.files[0])}
                    className="w-full px-4 py-2 border rounded-md focus:ring-indigo-400 focus:border-indigo-400"
                  />
                </div>
              ) : null}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
